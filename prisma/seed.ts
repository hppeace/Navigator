import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.issueSuggestion.deleteMany();
  await prisma.conversationRecord.deleteMany();
  await prisma.contactPerson.deleteMany();
  await prisma.careerRecord.deleteMany();
  await prisma.keyPerformance.deleteMany();
  await prisma.activityRecord.deleteMany();
  await prisma.memberProfile.deleteMany();

  await prisma.memberProfile.create({
    data: {
      employeeId: "LH2026001",
      department: "材料科学与工程学院",
      name: "周岚",
      gender: "女",
      birthDate: new Date("1989-03-17"),
      ethnicity: "汉族",
      hometown: "四川成都",
      politicalStatus: "中共党员",
      partyAge: "11年",
      partyRole: "党支部宣传委员",
      academicTitle: "教授 / 博导",
      mentorType: "博士生导师",
      researchDirection: "先进功能材料、柔性器件",
      workStartDate: new Date("2015-07-01"),
      schoolEntryDate: new Date("2018-09-01"),
      highestDegree: "博士研究生",
      biography:
        "本科毕业于四川大学高分子学院，后赴新加坡国立大学攻读博士，现主要负责柔性传感材料与器件方向科研团队建设。",
      talentPrograms: "2023年入选四川省学术技术带头人后备人选；2025年主持国家重点研发计划青年科学家项目。",
      idNumber: "5101********4218",
      phone: "13800001234",
      wechat: "zhoulan-lab",
      email: "zhoulan@example.edu.cn",
      maritalStatus: "已婚",
      spouseChildren: "配偶刘明，1988年生，中共党员，四川大学华西医院工作；女儿刘安安，2018年生。",
      emergencyContact: "刘明 13900004567",
      hobbies: "羽毛球、摄影、科普分享",
      partyIntent: "是",
      applicationSubmitted: true,
      developmentStage: "正式党员",
      politicalStudyNotes: "坚持每月参加理论学习，重点围绕科技报国与师德师风开展专题记录。",
      democraticReviewNotes: "已参加年度民主评议与师德考核，相关证明已归档。",
      activities: {
        create: [
          {
            date: new Date("2026-03-08"),
            title: "青年教师主题分享会",
            category: "主题分享",
            description: "围绕青年人才成长路径分享科研团队建设经验，并上传活动照片。",
            attachmentUrl: "/uploads/demo-activity.svg",
            attachmentName: "活动照片.svg",
            sortOrder: 0,
          },
          {
            date: new Date("2026-03-22"),
            title: "社区科普志愿服务",
            category: "志愿服务",
            description: "面向中学生开展柔性电子科普课堂，累计服务 120 人次。",
            sortOrder: 1,
          },
        ],
      },
      keyPerformances: {
        create: [
          {
            date: new Date("2026-02-14"),
            title: "柔性器件成果转化落地",
            description: "与地方企业完成成果转化签约，推动柔性压力传感器进入样机验证阶段。",
            externalLink: "https://example.edu.cn/news/flexible-device",
            sortOrder: 0,
          },
        ],
      },
      careerRecords: {
        create: [
          {
            date: new Date("2025-12-01"),
            title: "晋升教授",
            description: "完成职称评审，带领团队承担省部级重大任务。",
            sortOrder: 0,
          },
        ],
      },
      contacts: {
        create: [
          {
            role: "school",
            name: "张宏",
            title: "党委组织部副部长",
            note: "负责校级联系与成长观察。",
            sortOrder: 0,
          },
          {
            role: "college",
            name: "王宁",
            title: "学院党委副书记（国家级青年人才）",
            note: "定期跟进人才培养与思想动态。",
            sortOrder: 1,
          },
          {
            role: "mentor",
            name: "陈立",
            title: "成长导师 / 杰出教授",
            note: "重点指导科研组织与团队发展。",
            sortOrder: 2,
          },
        ],
      },
      conversations: {
        create: [
          {
            date: new Date("2026-03-29"),
            summary: "围绕团队扩张带来的管理压力开展谈心谈话。",
            confusion: "团队扩大后学生梯队协同与项目节奏控制压力明显上升。",
            actionPlan: "学院联系人协助对接行政支持，成长导师建议建立周例会机制。",
            sortOrder: 0,
          },
        ],
      },
      issueSuggestions: {
        create: [
          {
            type: "question",
            title: "希望增加高水平学术交流资源",
            content: "建议学校提供更稳定的国际合作访问渠道与短期交流名额。",
            status: "待跟进",
            sortOrder: 0,
          },
          {
            type: "suggestion",
            title: "增设人才家属融入支持",
            content: "建议在工作站活动中增加家属参与场景，提升归属感。",
            status: "已转交组织端",
            sortOrder: 1,
          },
        ],
      },
    },
  });

  await prisma.memberProfile.create({
    data: {
      employeeId: "LH2026002",
      department: "计算机学院",
      name: "宋川",
      gender: "男",
      birthDate: new Date("1992-09-04"),
      ethnicity: "汉族",
      hometown: "重庆",
      politicalStatus: "群众",
      academicTitle: "副教授 / 硕导",
      mentorType: "硕士生导师",
      researchDirection: "大模型系统、智能软件工程",
      workStartDate: new Date("2019-07-01"),
      schoolEntryDate: new Date("2021-01-01"),
      highestDegree: "博士研究生",
      biography:
        "长期从事大模型推理加速与软件工程智能化研究，承担学院新工科建设相关任务。",
      phone: "13900005678",
      email: "songchuan@example.edu.cn",
      maritalStatus: "未婚",
      emergencyContact: "宋建国 13600007890",
      hobbies: "长跑、桌游",
      partyIntent: "待考虑",
      applicationSubmitted: false,
      developmentStage: "群众",
      politicalStudyNotes: "已参加本学期两次理论学习，正在持续观察与培养。",
      activities: {
        create: [
          {
            date: new Date("2026-04-02"),
            title: "工作站开放日",
            category: "活动参与",
            description: "展示智能软件工程实验平台并与青年教师交流。",
            sortOrder: 0,
          },
        ],
      },
      contacts: {
        create: [
          {
            role: "school",
            name: "李珂",
            title: "党委组织部干部",
            sortOrder: 0,
          },
          {
            role: "college",
            name: "何倩",
            title: "学院党委委员",
            sortOrder: 1,
          },
          {
            role: "mentor",
            name: "赵峰",
            title: "成长导师 / 教授",
            sortOrder: 2,
          },
        ],
      },
      conversations: {
        create: [
          {
            date: new Date("2026-04-06"),
            summary: "沟通新课题申报压力与项目团队协同问题。",
            confusion: "新入校青年教师在项目资源整合方面经验不足。",
            actionPlan: "建议纳入学院重大项目申报辅导计划，并增加跨团队联合讨论。",
            sortOrder: 0,
          },
        ],
      },
      issueSuggestions: {
        create: [
          {
            type: "question",
            title: "需要更多实验空间协调支持",
            content: "希望学校在高性能设备与联合实验空间方面提供支持。",
            status: "沟通中",
            sortOrder: 0,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
