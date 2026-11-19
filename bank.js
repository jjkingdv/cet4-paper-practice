// 讲义第 13–17 页，仅收录有蓝色底纹的条目。
const sourceBank = [
  ["课程", [
    ["英语口语课程", "oral English courses"],
    ["人工智能基础课程", "basic artificial intelligence courses"],
    ["在线课程", "online courses"],
    ["职业指导课程", "career guidance courses"],
    ["创新创业课程", "innovation and entrepreneurship courses"],
    ["心理健康教育课程", "mental health education courses"],
    ["劳动教育课程", "labor education courses"],
    ["跨文化交际课程", "cross-cultural communication courses"],
    ["中国传统文化课程", "traditional Chinese culture courses"],
    ["国情与理想信念教育课程", "national conditions and ideal education courses"],
    ["环境保护课程", "environmental protection courses"]
  ]],
  ["演讲", [
    ["数字信息辨别讲座", "lectures on digital information recognition"],
    ["小组讨论", "group discussions"],
    ["就业指导讲座", "employment guidance lectures"],
    ["职业讲座", "career talks"],
    ["心理讲座", "psychological lectures"],
    ["睡眠健康与压力管理讲座", "lectures on sleep health and stress management"],
    ["传统文化传承讲座", "lectures on traditional Chinese culture inheritance"]
  ]],
  ["活动", [
    ["读书分享会", "book sharing activities"],
    ["演讲比赛", "speech contests"],
    ["辩论赛", "debate competitions"],
    ["短视频创作大赛", "short video creation competitions"],
    ["创新创业大赛", "innovation and entrepreneurship competitions"],
    ["模拟求职大赛", "simulated job hunting competitions"],
    ["体育赛事", "sports events"],
    ["传统文化体验活动", "traditional Chinese culture experience activities"],
    ["文化交流活动", "cultural exchange events"],
    ["数字文物摄影展", "digital cultural relic photography exhibitions"],
    ["校园清扫活动", "clean-up campaigns"],
    ["垃圾分类宣传活动", "garbage sorting publicity campaigns"],
    ["植树活动", "tree-planting events"],
    ["志愿服务活动", "volunteer service activities"],
    ["社区服务活动", "community service activities"]
  ]],
  ["培训", [
    ["数字素养培训", "digital literacy training"],
    ["职业技能培训", "vocational training"],
    ["创业培训", "entrepreneurship training"],
    ["简历制作与面试培训", "resume writing and interview training"],
    ["新媒体运营培训", "new media operation training"],
    ["时间管理培训", "time-management training"],
    ["沟通技巧培训", "training on communication skills"]
  ]],
  ["规划", [
    ["制定学习计划", "make study plans"],
    ["制定备考计划", "make exam preparation plans"],
    ["合理安排课余时间", "arrange spare time reasonably"],
    ["制定职业规划", "make career plans"]
  ]],
  ["项目", [
    ["科研创新项目", "scientific research innovation projects"],
    ["线上学习平台", "online learning platforms"],
    ["创新创业实践", "innovation and entrepreneurship practice"],
    ["专业实习", "professional internships"],
    ["毕业实习", "graduation internships"],
    ["校园劳动实践", "campus labor practice"],
    ["非遗传承实践活动", "intangible cultural heritage inheritance practice activities"],
    ["乡村振兴队伍", "rural revitalization teams"],
    ["乡村支教项目", "rural teaching support programs"],
    ["志愿者项目", "volunteer programs"],
    ["社会实践活动", "social practice activities"]
  ]],
  ["系统", [
    ["校园一卡通系统", "campus all-in-one card systems"],
    ["就业信息服务平台", "employment information service platforms"],
    ["心理健康咨询服务", "mental health counseling services"]
  ]],
  ["规定", [
    ["明确的手机使用规则", "clear rules on mobile phone use"]
  ]],
  ["常见动作", [
    ["提供", "offer sb. sth.", "provide sb. with sth."],
    ["帮助", "help sb. do sth."],
    ["教／指导", "teach sb. to do sth.", "guide sb. to do sth."],
    ["鼓励", "encourage sb. to do sth."],
    ["喜欢", "like sth.", "be fond of sth.", "have a deep affection for sth."],
    ["参与", "take part in sth.", "participate in sth.", "engage in sth.", "devote spare time to sth.", "devote oneself to sth."],
    ["精通", "be good at sth.", "be proficient in sth.", "have a good command of sth.", "have a good knowledge of sth.", "have a deep understanding of sth.", "master sth."],
    ["重视", "attach great importance to sth.", "put great emphasis on sth.", "focus on sth."],
    ["愿意", "be willing to do sth."],
    ["联系", "combine A with B", "associate A with B", "link A with B"]
  ]]
].flatMap(([category, rows]) => rows.map(([prompt, ...answers]) => ({ category, prompt, answers })));
