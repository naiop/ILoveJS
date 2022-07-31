/*
 Navicat Premium Data Transfer

 Source Server         : 47.103.68.175
 Source Server Type    : SQL Server
 Source Server Version : 11002100
 Source Host           : 47.103.68.175:1433
 Source Catalog        : Admin
 Source Schema         : dbo

 Target Server Type    : SQL Server
 Target Server Version : 11002100
 File Encoding         : 65001

 Date: 31/07/2022 15:27:28
*/


-- ----------------------------
-- Table structure for t_user
-- ----------------------------
IF EXISTS (SELECT * FROM sys.all_objects WHERE object_id = OBJECT_ID(N'[dbo].[t_user]') AND type IN ('U'))
	DROP TABLE [dbo].[t_user]
GO

CREATE TABLE [dbo].[t_user] (
  [Id] int  NOT NULL,
  [UserName] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [Password] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [name] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [mail] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [Active] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [roles] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [token] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [introduction] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [avatar] varchar(255) COLLATE Chinese_PRC_CI_AI  NULL,
  [CreateTime] datetime2(7)  NULL,
  [UpdateTime] datetime2(7)  NULL
)
GO

ALTER TABLE [dbo].[t_user] SET (LOCK_ESCALATION = TABLE)
GO


-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO [dbo].[t_user] ([Id], [UserName], [Password], [name], [mail], [Active], [roles], [token], [introduction], [avatar], [CreateTime], [UpdateTime]) VALUES (N'2', N'admin', N'111111', N'超级管理员', N'SuperAdminSystem@163.com', N'1', N'admin', N'9yZCI6ImVkaXRvciIsIlJvbGVzIjoiRWRpdG9yI', N'I am a super administrator', N'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', N'2020-07-06 10:21:58.0000000', N'2020-07-06 02:22:15.1030000')
GO

INSERT INTO [dbo].[t_user] ([Id], [UserName], [Password], [name], [mail], [Active], [roles], [token], [introduction], [avatar], [CreateTime], [UpdateTime]) VALUES (N'3', N'developer', N'111111', N'开发者', N'developer@user.com', N'1', N'admin,developer', N'developer_token', N'I am a super 开发者', N'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', N'2020-07-06 16:24:30.0000000', N'2020-07-06 08:26:06.8930000')
GO

INSERT INTO [dbo].[t_user] ([Id], [UserName], [Password], [name], [mail], [Active], [roles], [token], [introduction], [avatar], [CreateTime], [UpdateTime]) VALUES (N'4', N'editor', N'111111', N'编辑', N'editor@user.com', N'1', N',editor', N'1', N'I am a super 编辑者', N'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif', N'2020-07-06 07:51:43.7730000', N'2021-09-17 20:54:22.0000000')
GO

