import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "entered-chizhou-university",
		title: "进入池州学院，第一次正式接触代码",
		description:
			"2024 年 9 月入学池州学院，进入大数据与人工智能学院 24 计算机科学与技术 1 班，从大学课程开始真正接触编程。",
		type: "education",
		startDate: "2024-09-01",
		location: "安徽池州",
		organization: "池州学院 大数据与人工智能学院",
		skills: ["计算机基础", "程序设计入门", "C 语言基础", "学习规划"],
		achievements: [
			"开始学习计算机专业基础课程",
			"第一次系统接触代码和程序设计思想",
			"逐渐明确自己在计算机方向的学习目标",
		],
		icon: "material-symbols:school",
		color: "#2563EB",
		featured: true,
	},
	{
		id: "programming-foundation",
		title: "打基础：从语法到简单程序",
		description:
			"入学后从基础语法开始练习，逐步理解变量、条件、循环、函数等编程概念。",
		type: "achievement",
		startDate: "2024-10-01",
		location: "池州学院",
		skills: ["C 语言", "Python", "基础算法", "问题拆解"],
		achievements: [
			"完成课程中的基础编程练习",
			"开始理解代码如何解决实际问题",
			"养成记录笔记和复盘错误的习惯",
		],
		icon: "material-symbols:terminal",
		color: "#059669",
		featured: true,
	},
	{
		id: "web-learning",
		title: "开始学习网页与个人博客搭建",
		description:
			"在掌握一些编程基础后，开始接触 HTML、CSS、JavaScript 和静态博客，尝试把学习内容展示出来。",
		type: "project",
		startDate: "2025-01-12",
		organization: "个人学习",
		skills: ["HTML", "CSS", "JavaScript", "Astro", "Markdown"],
		achievements: [
			"搭建并定制个人博客 Serein",
			"学习页面结构、样式和交互的基本写法",
			"把学习笔记、文章、相册和个人信息整理到博客中",
		],
		links: [
			{
				name: "GitHub 主页",
				url: "https://github.com/sereinZ-Z-Z",
				type: "website",
			},
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "data-and-ai-learning",
		title: "接触数据分析与人工智能方向",
		description:
			"随着课程推进，开始接触 Python 数据处理、数据分析和机器学习基础内容，逐步了解人工智能方向。",
		type: "achievement",
		startDate: "2025-07-16",
		organization: "大数据与人工智能学院",
		skills: ["Python", "数据分析", "机器学习基础", "实验报告"],
		achievements: [
			"整理数据分析和机器学习相关笔记",
			"完成课程实验与报告写作",
			"开始把代码实践和理论知识结合起来",
		],
		icon: "material-symbols:psychology",
		color: "#EA580C",
	},
	{
		id: "continue-growing",
		title: "持续学习，完善个人作品",
		description:
			"继续围绕专业课程和个人兴趣学习编程，完善博客内容，积累课程项目和成长记录。",
		type: "project",
		startDate: "2026-02-27",
		skills: ["课程项目", "个人博客", "学习总结", "作品整理"],
		achievements: [
			"持续更新学习文章和成长记录",
			"计划整理更多课程项目和实践内容",
			"逐步形成自己的技术学习路线",
		],
		icon: "material-symbols:rocket-launch",
		color: "#DC2626",
	},
];
