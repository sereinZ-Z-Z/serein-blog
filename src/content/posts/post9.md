---
title: 用原生 Servlet 搭建一个饿了么点餐系统
published: 2026-07-02
description: 记录一次用原生 Servlet、JSP 和 JDBC 从零搭建饿了么点餐系统的课程设计经历，涵盖自研 MVC 框架、登录过滤器、购物车、下单事务与 Docker 部署全过程。
tags:
  - Java
  - Servlet
  - Web开发
  - 项目实践
category: 技术
draft: false
comment: true
---

这学期有一门课要求做一个 BS 架构的 Web 应用，选题是「饿了么点餐系统」。老师要求不用 SpringBoot、SpringMVC、MyBatis 这些框架，只能用最原始的 **Servlet + JSP + JDBC + MySQL**。刚开始觉得有点「返祖」，但真正做完之后，反而对 Web 请求处理、MVC 分层、过滤器、Session 和数据库事务有了更深的理解。

### 一、项目概览

| 项 | 说明 |
|----|------|
| 语言 | Java 8 |
| Web 容器 | Tomcat 8.5 |
| 数据库 | MySQL 8.x，库名 `elm` |
| 构建工具 | Maven（war 包） |
| 前端 | JSP + 原生 CSS/JS |
| 部署 | Docker Compose 一键启动 |

系统包含 7 张表：商家、食品、用户、购物车、送货地址、订单、订单明细。测试数据里塞了十多个商家（万家饺子、麦当劳、肯德基等），每个商家底下有多条食品。

### 二、自研简易 MVC：DispatcherServlet

最核心的类是一个 `DispatcherServlet`，注解 `@WebServlet("/api/*")`，所有 `/api/` 的 JSON 请求都由它统一分发。

流程很简单：

1. 从 `request.getPathInfo()` 解析出类名和方法名，例如 `/api/BusinessController/listBusinessByOrderTypeId` → `className = "BusinessController"`，`methodName = "listBusinessByOrderTypeId"`。
2. 用 `Class.forName` 加载 Controller 类，反射创建实例。
3. `getMethod` 找到对应方法，`invoke` 调用，拿到返回值。
4. 用 Jackson 的 `ObjectMapper` 把结果序列化为 JSON 写回客户端。

异常处理也做了包装：如果是登录相关异常返回 HTTP 401，其他异常返回 HTTP 500，统一用 `ApiResult.fail` 输出错误 JSON。

这个「迷你 SpringMVC」虽然简陋，但写完就理解了框架在背后做了什么：**路由解析 → 反射调用 → 序列化返回**。

### 三、登录态：LoginFilter + ApiAuth

所有请求都会被 `LoginFilter`（`@WebFilter("/*")`）拦截。核心逻辑是：

- 先判断路径是否**公开**（首页、商家浏览、搜索、登录注册、静态资源、部分 API）。
- 公开路径直接放行。
- 非公开路径检查 Session 里有没有 `loginUser`。
- 没有就返回 401 或重定向到登录页。

另外写了一个 `ApiAuth` 工具类，Controller 里统一用 `ApiAuth.currentUserId(request)` 拿当前用户 ID，**不信任请求参数里的 userId**，防止越权——这其实和 Spring Security 里的 `SecurityContextHolder` 思路很像。

### 四、数据库与事务：DBUtil + ThreadLocal

数据库连接管理用了一个 `DBUtil` 类，核心是用 `ThreadLocal<Connection>` 保证同一个线程里拿到的始终是同一个连接，这样在 Service 层里调用多个 DAO 操作时，可以共用同一个事务。

```java
// 简化示意
public class DBUtil {
    private static ThreadLocal<Connection> tl = new ThreadLocal<>();

    public static Connection getConnection() {
        Connection conn = tl.get();
        if (conn == null) {
            conn = DriverManager.getConnection(URL, USER, PASSWORD);
            tl.set(conn);
        }
        return conn;
    }
}
```

下单时涉及订单表、订单明细表、购物车清空，三步必须在一个事务里完成，否则可能出现「钱扣了但订单没生成」的脏数据。Service 层手动控制 `conn.setAutoCommit(false)` / `commit()` / `rollback()`，写完才体会到 Spring 的 `@Transactional` 到底省了多少事。

### 五、浏览与购物流程

**首页** → 分类入口，点击跳转商家列表。

**商家列表** → `BusinessController.listBusinessByOrderTypeId` 按分类查询商家，同时调用 `CartController.summaryCart` 查购物车数量，在商家卡片上显示角标。

**搜索** → 输入关键词，`BusinessServiceImpl.searchBusinesses` 模糊查询匹配的商家。

**商家详情** → 展示食品列表，前端 JS 实现加减按钮和总价实时计算。`FoodController` 通过 JOIN 查询 business 和 food 表，手动遍历 ResultSet 按商家 ID 聚合食品列表。这个「手动一对多映射」让我理解了 ORM 框架在干什么。

**购物车** → `CartServlet` 处理添加、修改数量、删除。购物车和商家绑定——跨商家的食品不能混在一个订单里。

**确认订单** → 选择送货地址，确认总价。`OrderServlet` 生成订单，扣减库存（实际项目里建议加乐观锁）。

**支付** → 模拟支付，跳转支付结果页。

**历史订单** → `OrdersController.listOrdersByUserId` 查当前用户所有订单，点进去看明细。

### 六、前端页面

系统有两套页面：标准移动端风格（根目录 JSP）和 PC 桌面版（`WebContent/desktop/`）。LoginFilter 分别处理两套页面的公开路径和登录拦截。

JSP 页面之间通过 `common.jspf` 复用公共片段（导航栏、底部菜单等），Session 中取当前用户信息渲染「我的」页面。

### 七、Docker 部署与冒烟测试

为了方便答辩演示，写了一个 `docker-compose.yml`，一键启动 Tomcat + MySQL：

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: elm
    ports:
      - "3306:3306"
  web:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
```

还写了一个简单的冒烟测试脚本，用 `curl` 依次请求首页、商家列表、登录接口，检查 HTTP 状态码，确保部署后各模块都能跑通。

### 八、踩过的坑

1. **DBCP 连接池与手动事务冲突**：最初想用连接池，但手动 `setAutoCommit(false)` 后连接归还池子时状态可能被污染，后来改成 `DriverManager` 直连 + `ThreadLocal`，在这个项目规模下足够用。

2. **JSP 中文乱码**：`request.setCharacterEncoding("UTF-8")` 要在 `doPost` 第一行调用，少写一行就全是问号。

3. **反射调用的异常包装**：`method.invoke` 抛出的 `InvocationTargetException` 需要用 `getCause()` 才能拿到真正的业务异常，不然日志里全是 `InvocationTargetException`，看不出到底哪里错了。

4. **跨域**：前端 JSP 和 `/api/` 同域其实不需要 CORS，但为了兼容本地开发时前后端分离的调试，还是加了一个 `CorsFilter`。

### 写在最后

这个项目做完，最大的收获不是「做出了一个点餐系统」，而是**理解了框架底层在做什么**：

- `DispatcherServlet` → SpringMVC 的 `DispatcherServlet`
- `LoginFilter` + `ApiAuth` → Spring Security 的 Filter Chain + SecurityContext
- `DBUtil` 的 `ThreadLocal` → Spring 的事务管理
- 手动 ResultSet 映射 → MyBatis 的 ResultMap

如果你也在学 Java Web，建议至少做一次「不用框架」的项目。**用完框架再回头看原生，会发现很多看似「魔法」的东西，其实逻辑并不复杂。**

> 项目位于 `Desktop/elm-jsp`，基于教学资源中的 Servlet 后端源码改造，补上了 JSP 页面、Session 登录态和 LoginFilter。