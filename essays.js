// 公开版用改述题干；范文和译文用于纸笔练习，不是官方答案。
const essayBank = [
  {
    id: "campus", title: "让校园生活更便利", page: 3, type: "提建议",
    prompt: "Your university wants ideas for improving students' everyday life on campus. Write a proposal with specific suggestions and explain how students would benefit from them.",
    task: "给学校写一份建议，说明怎样让校园生活更便利。提出具体措施，并说明这些措施能解决什么问题。",
    structure: "指出麻烦 → 提出两条建议并解释好处 → 征集反馈",
    paragraphs: [
      ["开头：指出问题", "学生浪费时间切换平台、排队。提出用两个小改动改善校园生活。",
        "Students often waste time switching between campus websites or waiting in line for simple services. To make campus life easier, I suggest two changes that would save students time and effort.",
        "学生常常在切换校园网站或排队办理简单事务上浪费时间。为了让校园生活更便利，我建议做两项改进，帮助学生节省时间和精力。"],
      ["建议一：整合线上服务", "把查课程安排和预约自习室放在同一个平台。学生查一次就能办好。",
        "First, the university could put common services on a single online platform. For example, students could check their class schedules and book study rooms in the same place. They would no longer have to search several websites for basic information.",
        "首先，学校可以把常用服务整合到一个线上平台。比如，学生能在同一个平台查看课程安排并预约自习室，不再需要到好几个网站上查找基本信息。"],
      ["建议二：完善校园一卡通", "一卡通可用于食堂和图书馆；手机能查余额、挂失；说清为什么更方便。",
        "Second, the university could improve its campus card system. Students should be able to use the same card at the dining hall and the library. They could also check their balance or report a lost card on their phones.",
        "其次，学校可以完善校园一卡通系统。学生应该可以在食堂和图书馆使用同一张卡，也可以在手机上查询余额或挂失。"],
      ["结尾：听反馈再推广", "先做简短问卷，确认调整解决的确实是学生每天遇到的问题。",
        "Before making these changes, the university should ask students about their main difficulties through a short survey. This would help it focus on problems that students actually face.",
        "在实施这些改进前，学校应通过简短的问卷了解学生遇到的主要困难，这样就能把精力放在学生真正面对的问题上。"]
    ]
  },
  {
    id: "research", title: "大学生是否都应参与科研", page: 5, type: "表态论证",
    prompt: "A university is considering a rule that every student must take part in at least one research project. Give your view on whether the rule is necessary and how practical it would be to carry out.",
    task: "回应「大学生至少参加一个科研项目」的建议。既要说明统一要求有没有必要，也要说明学校能不能做到、怎样做到。",
    structure: "有条件地支持 → 为什么不能只靠自愿 → 分组做小项目 → 人人体验",
    paragraphs: [
      ["开头：有条件地支持", "支持每人参加一次，但不要求每个人都进行复杂实验。",
        "I support the idea that every university student should take part in at least one research project. However, this does not mean that every student has to carry out a complex experiment.",
        "我支持每位大学生至少参加一个科研项目的想法。不过，这并不意味着每个人都必须开展复杂的实验。"],
      ["必要性：不只说科研有用", "科研能练习收集证据、得出结论；如果全凭自愿，没经验的学生可能一直不敢尝试。",
        "Research teaches students how to ask clear questions, collect evidence and draw conclusions. If participation is entirely voluntary, students with little research experience may never give it a try. A basic requirement would give them a reason to take the first step.",
        "科研教会学生怎样提出明确的问题、收集证据并得出结论。如果完全自愿，缺乏科研经验的学生可能一直不会去尝试。基本的参与要求能促使他们迈出第一步。"],
      ["可行性：遇到困难怎么办", "单独做实验容易给导师和设备带来压力。改成小组问卷，每个人有任务，不需要贵重设备。",
        "Since teachers and equipment are limited, universities could let students work in small groups. For example, a group could survey how classmates use online learning platforms. Each member could take responsibility for a task, such as designing questions or analysing the results.",
        "由于师资和设备有限，学校可以让学生分组开展项目。例如，一个小组可以调查同学如何使用线上学习平台。每个成员负责一项任务，比如设计问题或分析结果。"],
      ["结尾：回到要求本身", "人人有科研体验，项目难度和形式可以灵活。",
        "In short, the requirement is worthwhile if universities keep the projects manageable. The goal is to let everyone experience research, not to make everyone a professional researcher.",
        "总之，只要学校让项目的难度和规模在学生能力范围内，这项要求就值得实施。目标是让每个人都体验科研，而不是让每个人都成为专业研究人员。"]
    ]
  },
  {
    id: "robots", title: "未来机器人如何服务校园", page: 7, type: "展望应用",
    prompt: "Your campus newspaper is preparing a feature on how robots might be used at universities in the future. Write an article for it, describing possible uses and explaining why they would be helpful.",
    task: "为校报写一篇投稿，说明未来机器人能在校园里做什么。写出具体场景和任务，再解释其好处。",
    structure: "提出两个场景 → 辅助学习 → 支持校园服务 → 人仍负责重要决定",
    paragraphs: [
      ["开头：点明两个应用场景", "机器人不只是展示新技术，还能辅助学习、改善校园服务。",
        "In the future, robots could become useful helpers on campus. Rather than simply showing off new technology, universities could use them to support learning and improve daily campus services.",
        "未来，机器人可以成为校园里的得力助手。高校可以用它们辅助学习、改善日常校园服务，而不只是展示新技术。"],
      ["场景一：辅助学习", "机器人帮学生找在线课程和练习题；需要复习时，可以按自己的节奏学。",
        "First, robots could act as learning assistants. They can help students gain access to a wider range of learning materials, such as online courses and practice questions, so that students can study at their own pace.",
        "首先，机器人可以充当学习助手。它们能帮助学生获得更多学习资料，比如在线课程和练习题，让学生按自己的节奏学习。"],
      ["场景二：校园服务", "打扫公共区域、指引垃圾分类。减轻重复劳动，让工作人员处理更需要人工判断的事。",
        "Second, robots could take on routine campus tasks. For example, they could clean public areas or show students which bins to use for different types of waste. This would save staff time and let them focus on work that needs human judgment.",
        "其次，机器人可以承担校内日常事务。例如，它们可以打扫公共区域，或者告诉学生不同种类的垃圾该投进哪个垃圾桶。这能为工作人员节省时间，让他们专注于需要人工判断的工作。"],
      ["结尾：总结好处与边界", "机器人能让校园运转更顺畅，重要决定仍由人负责。",
        "Overall, robots could make campus life easier if they are given clear tasks. They should support teachers and staff, while people remain responsible for important decisions.",
        "总的来说，如果给机器人明确的任务，它们就能让校园生活更便利。机器人应协助教师和工作人员，重要决定仍由人负责。"]
    ]
  }
];
