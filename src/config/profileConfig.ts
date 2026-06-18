import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Serein",
	bio: "热爱编程、设计与生活记录的创作者",
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/sereinZ-Z-Z",
		},
		{
			name: "Email",
			icon: "mdi:email",
			url: "mailto:serein@czu.edu.cn",
		},
		{
			name: "QQ",
			icon: "mdi:qqchat",
			url: "https://wpa.qq.com/msgrd?v=3&uin=3373590584&site=qq&menu=yes",
		},
	],
};
