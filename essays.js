// 公开版题干使用改述；英文范文及中文译文均按讲义原段落录入。
const essayBank = [
  {
    id: "campus", title: "让校园生活更便利", page: 3, type: "提建议",
    prompt: "Your university wants ideas for improving students' everyday life on campus. Write a proposal with specific suggestions and explain how students would benefit from them.",
    task: "给学校写一份建议，说明怎样让校园生活更便利。提出具体措施，并说明这些措施能解决什么问题。",
    structure: "校园便利的重要性 → 三条措施 → 减轻压力、改善校园生活",
    paragraphs: [
      ["开头：说明为什么重要", "校园生活更便利有利于学业和身心健康，因此需要采取措施。",
        "It is true that making students' campus life easier is essential to their academic development and well-being. Therefore, there are some effective steps that should be adopted.",
        "确实，让学生的校园生活更轻松对其学业发展与身心健康至关重要。因此，应采取一些有效措施来实现这一目标。"],
      ["正文：三条具体建议", "先完善设施和平台（线上选课、一卡通）；再增设心理健康课程并组织活动；最后请优秀学生分享学习和生活经验。",
        "First, universities could cooperate with clubs and departments to improve related facilities and build useful platforms, including online course selection systems and campus all-in-one card systems. Second, universities should offer more courses related to mental health education and organize diverse activities, such as sports events and campus art festivals, which can help students maintain physical and mental health. Third, universities can invite outstanding students to share their experience and provide useful guidance on efficient learning and daily trouble solving.",
        "首先，高校可联合社团与各院系完善相关设施，搭建实用平台，包括线上选课系统与校园一卡通系统。其次，高校应开设更多心理健康教育相关课程，开展丰富多彩的活动，如体育赛事与校园文化艺术节，帮助学生保持身心健康。第三，高校可邀请优秀学生分享经验，围绕高效学习与日常问题解决提供实用指导。"],
      ["结尾：总结措施的好处", "措施落实后，学生能减轻压力，享有更舒适、更有意义的校园生活。",
        "In conclusion, if these measures are carried out effectively, this goal will be better achieved. Students will not only relieve their daily pressure, but also enjoy a more comfortable and meaningful campus life.",
        "总而言之，若这些措施得到有效落实，就能更好地实现这一目标。学生不仅能缓解日常压力，还能享有更舒适、更有意义的校园生活。"]
    ]
  },
  {
    id: "research", title: "大学生是否都应参与科研", page: 5, type: "表态论证",
    prompt: "A university is considering a rule that every student must take part in at least one research project. Give your view on whether the rule is necessary and how practical it would be to carry out.",
    task: "回应「大学生至少参加一个科研项目」的建议。既要说明统一要求有没有必要，也要说明学校能不能做到、怎样做到。",
    structure: "引出争议、有条件支持 → 学习与就业好处、实施困难 → 提出落实办法",
    paragraphs: [
      ["开头：引出争议与立场", "有人看重科研的好处，有人担心问题。作者支持推行，但主张加上合理限制。",
        "Currently, there is a heated debate over whether university students should be required to participate in at least one research project. Opinions are divided on this issue, with some praising its advantages and others worrying about its hidden problems. From my perspective, a balanced approach is preferable, where this requirement is permitted with certain reasonable limitations.",
        "目前，关于是否应要求大学生至少参与一项科研项目，人们展开了激烈的争论。对此各方观点不一，有人称赞其益处，也有人担忧其潜在问题。在我看来，更可取的是采取折中方案，允许推行这一要求，但需辅以合理的限制条件。"],
      ["正文：先好处，再困难", "科研能练批判性思维和独立分析能力，也能提升就业竞争力；但资源有限、指导质量不一可能影响落实。",
        "There is no doubt that this practice brings a multitude of positive outcomes. By taking part in research projects, college students can cultivate their critical thinking, develop their capacity to analyze problems independently, and improve their comprehensive abilities. In addition, such experiences develop practical research skills that employers highly value, which can greatly enhance students' employability. However, we cannot ignore that limited resources and uneven guidance quality may undermine effective implementation.",
        "毫无疑问，这一做法会带来诸多积极影响。通过参与科研项目，大学生能够培养批判性思维，锻炼独立分析问题的能力，提升自身综合素养。此外，这类经历能练就雇主高度看重的实用科研技能，可大幅提升学生的就业竞争力。但我们不能忽视，资源有限、指导质量不均可能会削弱实施效果。"],
      ["结尾：提出办法", "与科研机构合作，增加实践机会；请优秀学生分享经验，发挥科研价值。",
        "To maximize the benefits and minimize the challenges, universities are supposed to cooperate with research institutions to provide more practical opportunities and invite outstanding students to share their experience. It is through these combined efforts that the full potential of research projects can be realized.",
        "为了实现效益最大化、挑战最小化，高校应当与科研机构展开合作，提供更多实践机会，并邀请优秀学生分享经验。唯有通过这些共同努力，才能充分释放科研项目的全部潜力。"]
    ]
  },
  {
    id: "robots", title: "未来机器人如何服务校园", page: 7, type: "展望应用",
    prompt: "Your campus newspaper is preparing a feature on how robots might be used at universities in the future. Write an article for it, describing possible uses and explaining why they would be helpful.",
    task: "为校报写一篇投稿，说明未来机器人能在校园里做什么。写出具体场景和任务，再解释其好处。",
    structure: "展望校园应用 → 辅助学习和校园管理 → 提高效率、改善生活",
    paragraphs: [
      ["开头：展望校园应用", "机器人未来会用于校园的多个领域，并带来好处。",
        "It is true that future applications of robots on campus are essential to university development. In the near future, robots will be widely applied in various fields of campus life and bring a multitude of positive outcomes.",
        "确实，机器人在校园的未来应用对大学发展至关重要。在不久的将来，机器人将被广泛应用于校园生活的各个领域，并带来许多积极成果。"],
      ["正文：两个应用场景", "学习：找在线课程、学术数据库和多媒体课程，方便自主学习；管理：负责校园清洁、垃圾分类宣传，为师生节省时间和精力。",
        "Firstly, in terms of academic study, robots will act as intelligent learning assistants. They can help students gain access to a wider range of learning materials, such as online courses, academic databases and multimedia lessons, allowing flexible and self-paced study. Secondly, for daily campus management, robots will take charge of routine work, including campus clean-up campaigns and garbage sorting publicity campaigns, saving valuable time and effort for students and teachers.",
        "首先，在学业学习方面，机器人将充当智能学习助手。它们可以帮助学生获取更广泛的学习资料，如在线课程、学术数据库和多媒体课程，从而实现灵活、自主节奏的学习。其次，在日常校园管理方面，机器人将负责常规工作，包括校园清洁活动和垃圾分类宣传活动，为学生和教师节省宝贵的时间和精力。"],
      ["结尾：总结校园收益", "机器人能提高校园运行效率，让学生的校园生活更便捷、更舒适。",
        "In conclusion, the application of robots on campus is a promising trend. It will not only considerably improve campus operational efficiency, but also help students enjoy a more convenient and comfortable campus life.",
        "总之，机器人在校园的应用是一个前景广阔的趋势。它不仅能大幅提高校园运营效率，还能帮助学生享受更便捷、更舒适的校园生活。"]
    ]
  }
];
