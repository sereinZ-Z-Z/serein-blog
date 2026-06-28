import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true, // 启用看板娘
	models: ["/pio/models/NOIR/noir.model3.json"], // 默认模型路径
	position: "left", // 模型位置
	width: 280, // 默认宽度
	height: 250, // 默认高度
	mode: "draggable", // 默认为可拖拽模式
	hiddenOnMobile: true, // 默认在移动设备上隐藏
	hideAboutMenu: false, // 隐藏内置 About 菜单按钮
	dialog: {
		welcome: "欢迎来到 Serein 的小屋～", // 欢迎词
		touch: [
			"你在干嘛呀？",
			"别一直戳我啦！",
			"再摸就要生气了哦～",
			"不许欺负我！",
		], // 触摸提示
		home: "点这里回首页哦！", // 首页提示
		skin: ["想看看新衣服吗？", "这套搭配还不错吧～"], // 换装提示
		close: "下次再来玩呀，拜拜～", // 关闭提示
		link: "https://github.com/sereinZ-Z-Z/serein-blog", // 关于链接
	},
};