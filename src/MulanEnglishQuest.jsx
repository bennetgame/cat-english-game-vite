import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* =========================================================================
   木兰英语冒险 · Mulan English Quest
   主角：木兰 Mulan（银斑纹英国短毛猫），按角色设定表实现表情系统
   面向 13-15 岁学习者的英语小游戏 MVP（单文件 React + Tailwind）
   所有题目均为「演示题库」，可整体替换为教材内容，见文件底部注释。
   ========================================================================= */

/* ---------------------------------------------------------------------
   1. 演示题库 DEMO CONTENT
   --------------------------------------------------------------------- */

/* ===== 教材一：北师大版 五年级上册（一起点） ===== */
const UNITS_BNU = [
  { id: 1, en: "Different friends", zh: "不同的朋友" },
  { id: 2, en: "My feelings", zh: "我的感受" },
  { id: 3, en: "Work and play", zh: "学习与娱乐" },
  { id: 4, en: "Healthy habits", zh: "健康习惯" },
  { id: 5, en: "Food we eat", zh: "我们吃的食物" },
  { id: 6, en: "Nature and us", zh: "自然与我们" },
];

// 单词库：unit = 单元，group = 词义类别（用于分类识别题），level 1-3 = 难度
const WORDS_BNU = [
  // Unit 1 Different friends
  { id: "w101", en: "tall", emoji: "🦒", zh: "高的", unit: 1, group: "外貌性格", level: 1, sent: "My friend Ben is very ____." },
  { id: "w102", en: "short", emoji: "🐹", zh: "矮的", unit: 1, group: "外貌性格", level: 1, sent: "Lily is ____, but she runs fast." },
  { id: "w103", en: "quiet", emoji: "🤫", zh: "安静的", unit: 1, group: "外貌性格", level: 1, sent: "Tom is ____ in class." },
  { id: "w104", en: "friendly", emoji: "🤝", zh: "友好的", unit: 1, group: "外貌性格", level: 2, sent: "She is ____ to everyone." },
  { id: "w105", en: "polite", emoji: "🙇", zh: "有礼貌的", unit: 1, group: "外貌性格", level: 2, sent: "A ____ boy says thank you." },
  { id: "w106", en: "clever", emoji: "💡", zh: "聪明的", unit: 1, group: "外貌性格", level: 2, sent: "My cat is very ____." },
  { id: "w107", en: "helpful", emoji: "🧹", zh: "乐于助人的", unit: 1, group: "外貌性格", level: 2, sent: "Anna is ____ at home." },
  { id: "w108", en: "funny", emoji: "🤣", zh: "有趣的", unit: 1, group: "外貌性格", level: 1, sent: "His story is really ____." },
  // Unit 2 My feelings
  { id: "w201", en: "happy", emoji: "😄", zh: "高兴的", unit: 2, group: "情绪", level: 1, sent: "I feel ____ today." },
  { id: "w202", en: "sad", emoji: "😢", zh: "难过的", unit: 2, group: "情绪", level: 1, sent: "Why are you ____?" },
  { id: "w203", en: "angry", emoji: "😠", zh: "生气的", unit: 2, group: "情绪", level: 1, sent: "Dad is ____ about the mess." },
  { id: "w204", en: "afraid", emoji: "😨", zh: "害怕的", unit: 2, group: "情绪", level: 2, sent: "My sister is ____ of dogs." },
  { id: "w205", en: "tired", emoji: "🥱", zh: "疲倦的", unit: 2, group: "情绪", level: 1, sent: "He feels ____ after school." },
  { id: "w206", en: "worried", emoji: "😟", zh: "担心的", unit: 2, group: "情绪", level: 3, sent: "Mum is ____ about the test." },
  { id: "w207", en: "excited", emoji: "🤩", zh: "兴奋的", unit: 2, group: "情绪", level: 3, sent: "We are ____ about the party." },
  // Unit 3 Work and play
  { id: "w301", en: "study", emoji: "📚", zh: "学习", unit: 3, group: "学习与娱乐", level: 1, sent: "I ____ English every evening." },
  { id: "w302", en: "work", emoji: "💼", zh: "工作", unit: 3, group: "学习与娱乐", level: 1, sent: "My parents ____ in a school." },
  { id: "w303", en: "job", emoji: "🧑‍🔧", zh: "工作；职业", unit: 3, group: "学习与娱乐", level: 1, sent: "Her ____ is very busy." },
  { id: "w304", en: "exercise", emoji: "🏃", zh: "运动；锻炼", unit: 3, group: "学习与娱乐", level: 2, sent: "We do ____ in the morning." },
  { id: "w305", en: "game", emoji: "🎮", zh: "游戏", unit: 3, group: "学习与娱乐", level: 1, sent: "They play a ____ after class." },
  { id: "w306", en: "sport", emoji: "⚽", zh: "体育运动", unit: 3, group: "学习与娱乐", level: 2, sent: "Football is my favourite ____." },
  { id: "w307", en: "busy", emoji: "⏰", zh: "忙碌的", unit: 3, group: "学习与娱乐", level: 2, sent: "Monday is a ____ day." },
  { id: "w308", en: "always", zh: "总是", emoji: "🔁", unit: 3, group: "频次副词", level: 2, sent: "He is ____ on time." },
  { id: "w309", en: "often", zh: "经常", emoji: "🔂", unit: 3, group: "频次副词", level: 2, sent: "We ____ play games on Friday." },
  { id: "w310", en: "sometimes", zh: "有时", emoji: "🎲", unit: 3, group: "频次副词", level: 3, sent: "I ____ read before bed." },
  { id: "w311", en: "never", zh: "从不", emoji: "🚫", unit: 3, group: "频次副词", level: 2, sent: "She ____ eats junk food." },
  // Unit 4 Healthy habits
  { id: "w401", en: "brush", emoji: "🪥", zh: "刷", unit: 4, group: "健康习惯", level: 1, sent: "I ____ my teeth twice a day." },
  { id: "w402", en: "teeth", emoji: "🦷", zh: "牙齿", unit: 4, group: "健康习惯", level: 1, sent: "Clean your ____ before bed." },
  { id: "w403", en: "wash", emoji: "🧼", zh: "洗", unit: 4, group: "健康习惯", level: 1, sent: "____ your hands before lunch." },
  { id: "w404", en: "early", emoji: "🌅", zh: "早地", unit: 4, group: "健康习惯", level: 2, sent: "I get up ____ every day." },
  { id: "w405", en: "habit", emoji: "✅", zh: "习惯", unit: 4, group: "健康习惯", level: 2, sent: "Going to bed early is a good ____." },
  { id: "w406", en: "healthy", emoji: "💪", zh: "健康的", unit: 4, group: "健康习惯", level: 2, sent: "Fruit is ____ food." },
  { id: "w407", en: "sleep", emoji: "😴", zh: "睡觉", unit: 4, group: "健康习惯", level: 1, sent: "Children need nine hours of ____." },
  // Unit 5 Food we eat
  { id: "w501", en: "vegetable", emoji: "🥦", zh: "蔬菜", unit: 5, group: "食物", level: 2, sent: "Eat more ____ every day." },
  { id: "w502", en: "fruit", emoji: "🍎", zh: "水果", unit: 5, group: "食物", level: 1, sent: "An apple is a kind of ____." },
  { id: "w503", en: "meat", emoji: "🍖", zh: "肉", unit: 5, group: "食物", level: 1, sent: "He does not eat ____." },
  { id: "w504", en: "rice", emoji: "🍚", zh: "米饭", unit: 5, group: "食物", level: 1, sent: "We have ____ for lunch." },
  { id: "w505", en: "bread", emoji: "🍞", zh: "面包", unit: 5, group: "食物", level: 1, sent: "I want some ____ and milk." },
  { id: "w506", en: "milk", emoji: "🥛", zh: "牛奶", unit: 5, group: "食物", level: 1, sent: "Drink a glass of ____." },
  { id: "w507", en: "water", emoji: "💧", zh: "水", unit: 5, group: "食物", level: 1, sent: "Please give me some ____." },
  { id: "w508", en: "hungry", emoji: "🍽️", zh: "饥饿的", unit: 5, group: "食物", level: 2, sent: "The cat looks ____." },
  // Unit 6 Nature and us
  { id: "w601", en: "nature", emoji: "🌿", zh: "自然", unit: 6, group: "自然", level: 2, sent: "We love ____ and animals." },
  { id: "w602", en: "tree", emoji: "🌳", zh: "树", unit: 6, group: "自然", level: 1, sent: "There is a big ____ in the park." },
  { id: "w603", en: "flower", emoji: "🌸", zh: "花", unit: 6, group: "自然", level: 1, sent: "This ____ smells nice." },
  { id: "w604", en: "animal", emoji: "🐼", zh: "动物", unit: 6, group: "自然", level: 1, sent: "A panda is a lovely ____." },
  { id: "w605", en: "river", emoji: "🏞️", zh: "河流", unit: 6, group: "自然", level: 1, sent: "Fish live in the ____." },
  { id: "w606", en: "mountain", emoji: "⛰️", zh: "高山", unit: 6, group: "自然", level: 2, sent: "The ____ is very high." },
  { id: "w607", en: "earth", emoji: "🌍", zh: "地球", unit: 6, group: "自然", level: 2, sent: "The ____ is our home." },
  { id: "w608", en: "protect", emoji: "🛡️", zh: "保护", unit: 6, group: "自然", level: 3, sent: "We should ____ the animals." },
];

// 常用词组
const PHRASES_BNU = [
  { id: "p101", en: "be friendly to", zh: "对……友好", unit: 1 },
  { id: "p102", en: "look after", zh: "照顾；照看", unit: 1 },
  { id: "p201", en: "feel happy", zh: "感到高兴", unit: 2 },
  { id: "p202", en: "feel tired", zh: "感到疲倦", unit: 2 },
  { id: "p301", en: "do exercise", zh: "做运动", unit: 3 },
  { id: "p302", en: "play games", zh: "做游戏", unit: 3 },
  { id: "p303", en: "read books", zh: "看书", unit: 3 },
  { id: "p401", en: "keep healthy", zh: "保持健康", unit: 4 },
  { id: "p402", en: "brush teeth", zh: "刷牙", unit: 4 },
  { id: "p403", en: "wash hands", zh: "洗手", unit: 4 },
  { id: "p404", en: "get up early", zh: "早起", unit: 4 },
  { id: "p405", en: "go to bed early", zh: "早睡", unit: 4 },
  { id: "p406", en: "good habits", zh: "好习惯", unit: 4 },
  { id: "p501", en: "eat well", zh: "好好吃饭", unit: 5 },
  { id: "p502", en: "healthy food", zh: "健康食品", unit: 5 },
  { id: "p503", en: "junk food", zh: "垃圾食品", unit: 5 },
  { id: "p601", en: "protect nature", zh: "保护自然", unit: 6 },
  { id: "p602", en: "take care of", zh: "爱护；照料", unit: 6 },
  { id: "p603", en: "plant trees", zh: "种树", unit: 6 },
];

// 句子库：gap = 听力填空要挖掉的词
const SENTENCES_BNU = [
  { id: "s101", en: "What is your friend like?", zh: "你的朋友是个怎样的人？", unit: 1, level: 1, gap: "friend" },
  { id: "s102", en: "She is clever and polite.", zh: "她既聪明又有礼貌。", unit: 1, level: 1, gap: "polite" },
  { id: "s103", en: "My friend is tall and friendly.", zh: "我的朋友又高又友好。", unit: 1, level: 2, gap: "friendly" },
  { id: "s104", en: "Is he quiet in class?", zh: "他在课堂上安静吗？", unit: 1, level: 1, gap: "quiet" },
  { id: "s201", en: "How do you feel today?", zh: "你今天感觉怎么样？", unit: 2, level: 1, gap: "feel" },
  { id: "s202", en: "I feel happy about the party.", zh: "我为这次聚会感到高兴。", unit: 2, level: 2, gap: "happy" },
  { id: "s203", en: "He feels tired after school.", zh: "他放学后感到疲倦。", unit: 2, level: 2, gap: "tired" },
  { id: "s204", en: "Why is she sad?", zh: "她为什么难过？", unit: 2, level: 1, gap: "sad" },
  { id: "s205", en: "Because she lost her pen.", zh: "因为她把钢笔弄丢了。", unit: 2, level: 2, gap: "lost" },
  { id: "s301", en: "How often do you do exercise?", zh: "你多久做一次运动？", unit: 3, level: 2, gap: "exercise" },
  { id: "s302", en: "I often play games with my friends.", zh: "我经常和朋友们做游戏。", unit: 3, level: 2, gap: "games" },
  { id: "s303", en: "My father works in a hospital.", zh: "我爸爸在医院工作。", unit: 3, level: 2, gap: "works" },
  { id: "s304", en: "We read books after dinner.", zh: "我们晚饭后看书。", unit: 3, level: 1, gap: "books" },
  { id: "s401", en: "We should brush our teeth every day.", zh: "我们应该每天刷牙。", unit: 4, level: 2, gap: "teeth" },
  { id: "s402", en: "I get up early every morning.", zh: "我每天早上早起。", unit: 4, level: 1, gap: "early" },
  { id: "s403", en: "She never eats junk food.", zh: "她从不吃垃圾食品。", unit: 4, level: 2, gap: "never" },
  { id: "s404", en: "Wash your hands before lunch.", zh: "午饭前洗手。", unit: 4, level: 1, gap: "hands" },
  { id: "s501", en: "What would you like?", zh: "你想要吃点什么？", unit: 5, level: 1, gap: "like" },
  { id: "s502", en: "I would like some vegetables and milk.", zh: "我想要一些蔬菜和牛奶。", unit: 5, level: 2, gap: "vegetables" },
  { id: "s503", en: "He likes rice and meat.", zh: "他喜欢米饭和肉。", unit: 5, level: 1, gap: "rice" },
  { id: "s504", en: "Drink a glass of milk every day.", zh: "每天喝一杯牛奶。", unit: 5, level: 2, gap: "milk" },
  { id: "s601", en: "We should protect the animals.", zh: "我们应该保护动物。", unit: 6, level: 2, gap: "protect" },
  { id: "s602", en: "We can plant more trees.", zh: "我们可以多种树。", unit: 6, level: 2, gap: "trees" },
  { id: "s603", en: "Do not litter in the park.", zh: "不要在公园乱扔垃圾。", unit: 6, level: 3, gap: "litter" },
  { id: "s604", en: "There is a river near the mountain.", zh: "山附近有一条河。", unit: 6, level: 2, gap: "river" },
];

// 听问答：听到问题，选出合适的回答
const QA_PAIRS_BNU = [
  { id: "q101", unit: 1, q: "What is your friend like?", answer: "She is clever and helpful.", wrong: ["I am ten years old.", "It is on the desk.", "Yes, I like it."] },
  { id: "q102", unit: 1, q: "Is your brother quiet?", answer: "No, he isn't. He is funny.", wrong: ["Yes, I can swim.", "It is a red bag.", "He is in the park."] },
  { id: "q201", unit: 2, q: "How do you feel today?", answer: "I feel excited.", wrong: ["I go to school by bus.", "She is my sister.", "It is Monday."] },
  { id: "q202", unit: 2, q: "Why is Tom angry?", answer: "Because his bike is broken.", wrong: ["He is twelve.", "Yes, he is tall.", "In the classroom."] },
  { id: "q301", unit: 3, q: "How often do you play sports?", answer: "Three times a week.", wrong: ["In the library.", "With my cat.", "It is very funny."] },
  { id: "q302", unit: 3, q: "What does your mother do?", answer: "She is a doctor.", wrong: ["She feels sad.", "At seven o'clock.", "Yes, she does."] },
  { id: "q401", unit: 4, q: "When do you go to bed?", answer: "At nine thirty.", wrong: ["I brush my teeth.", "It is healthy.", "By bike."] },
  { id: "q402", unit: 4, q: "Is eating vegetables a good habit?", answer: "Yes, it is.", wrong: ["No, thank you.", "It is behind the door.", "She is worried."] },
  { id: "q501", unit: 5, q: "What would you like for breakfast?", answer: "I would like some bread and milk.", wrong: ["I am fine, thanks.", "It is under the tree.", "He is my friend."] },
  { id: "q502", unit: 5, q: "Do you like junk food?", answer: "No, I don't. It is not healthy.", wrong: ["Yes, it is a river.", "She is tired.", "At school."] },
  { id: "q601", unit: 6, q: "How can we protect nature?", answer: "We can plant more trees.", wrong: ["We are late.", "It is my job.", "Yes, I am afraid."] },
  { id: "q602", unit: 6, q: "Where do fish live?", answer: "They live in the river.", wrong: ["They are polite.", "At six in the evening.", "Because it is hot."] },
];

// 语境选词
const CLOZE_BNU = [
  { id: "c101", unit: 1, level: 1, text: "Sam always helps others. He is very ____.", options: ["helpful", "hungry", "short", "tired"], answer: "helpful", zh: "Sam 总是帮助别人，他很乐于助人。" },
  { id: "c102", unit: 1, level: 2, text: "Be ____ to your new classmates.", options: ["friendly", "funny", "early", "clever"], answer: "friendly", zh: "对你的新同学友好一些。" },
  { id: "c201", unit: 2, level: 1, text: "I lost my dog. I feel very ____.", options: ["sad", "excited", "polite", "busy"], answer: "sad", zh: "我把狗弄丢了，我感到很难过。" },
  { id: "c202", unit: 2, level: 2, text: "Tomorrow is my birthday. I am so ____.", options: ["excited", "worried", "afraid", "quiet"], answer: "excited", zh: "明天是我的生日，我太兴奋了。" },
  { id: "c301", unit: 3, level: 2, text: "I ____ do exercise in the morning.", options: ["often", "very", "much", "many"], answer: "often", zh: "我经常在早上做运动。" },
  { id: "c302", unit: 3, level: 2, text: "My aunt has a busy ____ in a bank.", options: ["job", "game", "sport", "habit"], answer: "job", zh: "我姑姑在银行有一份忙碌的工作。" },
  { id: "c401", unit: 4, level: 2, text: "We ____ wash our hands before meals.", options: ["should", "would", "are", "does"], answer: "should", zh: "我们饭前应该洗手。" },
  { id: "c402", unit: 4, level: 1, text: "Going to bed early is a good ____.", options: ["habit", "food", "friend", "river"], answer: "habit", zh: "早睡是一个好习惯。" },
  { id: "c501", unit: 5, level: 2, text: "I would like a ____ of milk.", options: ["glass", "piece", "pair", "box"], answer: "glass", zh: "我想要一杯牛奶。" },
  { id: "c502", unit: 5, level: 2, text: "Too much ____ food is bad for you.", options: ["junk", "fresh", "quiet", "clever"], answer: "junk", zh: "太多垃圾食品对你有害。" },
  { id: "c601", unit: 6, level: 2, text: "We can ____ more trees on the hill.", options: ["plant", "plan", "play", "place"], answer: "plant", zh: "我们可以在山上多种树。" },
  { id: "c602", unit: 6, level: 3, text: "____ litter in the river, please.", options: ["Don't", "Doesn't", "Not", "No be"], answer: "Don't", zh: "请不要往河里扔垃圾。" },
];

// 对话补全
const DIALOGUES_BNU = [
  {
    id: "d101", unit: 1, level: 1,
    lines: [
      { who: "Emma", text: "What is your new friend like?" },
      { who: "Leo", text: "____" },
      { who: "Emma", text: "She sounds nice!" },
    ],
    options: ["She is quiet and clever.", "It is a blue notebook.", "Yes, it was yesterday.", "I am from Canada."],
    answer: "She is quiet and clever.",
    explain: "What ... like? 问的是人的性格特征，要用形容词回答。",
  },
  {
    id: "d201", unit: 2, level: 2,
    lines: [
      { who: "Mum", text: "You look tired. How do you feel?" },
      { who: "Ben", text: "____" },
      { who: "Mum", text: "Then go to bed early tonight." },
    ],
    options: ["I feel very tired today.", "It is next to the bank.", "No, I don't like apples.", "He goes to school by bus."],
    answer: "I feel very tired today.",
    explain: "How do you feel? 要用 I feel + 情绪形容词 回答。",
  },
  {
    id: "d301", unit: 3, level: 2,
    lines: [
      { who: "Jack", text: "____" },
      { who: "Lily", text: "I play basketball twice a week." },
    ],
    options: ["How often do you play basketball?", "How old are you?", "Where is the library?", "Who is your teacher?"],
    answer: "How often do you play basketball?",
    explain: "回答给出的是频次 twice a week，所以要用 How often 提问。",
  },
  {
    id: "d401", unit: 4, level: 2,
    lines: [
      { who: "Doctor", text: "You should not eat junk food." },
      { who: "Tom", text: "____" },
      { who: "Doctor", text: "Good. And go to bed before ten." },
    ],
    options: ["OK, I will eat more vegetables.", "It is a big mountain.", "She is my sister.", "Yes, I am ten."],
    answer: "OK, I will eat more vegetables.",
    explain: "医生给出健康建议，合理的回应是接受建议并说明打算怎么做。",
  },
  {
    id: "d501", unit: 5, level: 1,
    lines: [
      { who: "Waiter", text: "What would you like?" },
      { who: "Amy", text: "____" },
    ],
    options: ["I would like some rice and fish.", "I am eleven years old.", "It is on Sunday.", "Yes, she is hungry."],
    answer: "I would like some rice and fish.",
    explain: "What would you like? 用 I would like ... 回答想要的食物。",
  },
  {
    id: "d601", unit: 6, level: 2,
    lines: [
      { who: "Teacher", text: "How can we protect the river?" },
      { who: "Zoe", text: "____" },
      { who: "Teacher", text: "That's a great idea." },
    ],
    options: ["We should not litter in it.", "I would like some bread.", "He is very polite.", "It is my favourite game."],
    answer: "We should not litter in it.",
    explain: "问的是保护河流的方法，要用 should / can 给出具体做法。",
  },
];

// 简单阅读理解
const READINGS_BNU = [
  {
    id: "r101", unit: 1, level: 2,
    title: "My Friend Mia",
    text: "Mia is my best friend. She is tall and quiet. She never says bad words, and she is polite to our teachers. Mia is also helpful. She helps me with my maths homework every Friday. On weekends we ride bikes in the park.",
    questions: [
      { q: "What is Mia like?", options: ["Tall and quiet", "Short and funny", "Busy and tired", "Angry and sad"], answer: "Tall and quiet", explain: "第二句写道 Mia 又高又安静。" },
      { q: "When does Mia help with maths?", options: ["Every Friday", "Every Sunday", "Every morning", "Before lunch"], answer: "Every Friday", explain: "文中说她每周五帮忙做数学作业。" },
    ],
  },
  {
    id: "r401", unit: 4, level: 2,
    title: "Ken's Healthy Day",
    text: "Ken gets up at six thirty. He washes his hands and brushes his teeth. For breakfast he has bread, milk and an apple. He never eats junk food. After school Ken does exercise for half an hour. He goes to bed at nine, so he is never tired in class.",
    questions: [
      { q: "What does Ken have for breakfast?", options: ["Bread, milk and an apple", "Rice and meat", "Only milk", "Junk food"], answer: "Bread, milk and an apple", explain: "第三句列出了他的早餐。" },
      { q: "Why is Ken never tired in class?", options: ["He goes to bed at nine", "He drinks tea", "He sits at the back", "He studies less"], answer: "He goes to bed at nine", explain: "最后一句说他九点睡觉，所以上课从不疲倦。" },
    ],
  },
  {
    id: "r601", unit: 6, level: 3,
    title: "The River Behind Our School",
    text: "There is a small river behind our school. Last year the water was dirty. Our class made some signs and put them near the river. The signs say, 'Do not litter.' Now people take care of the river. Fish come back, and birds sing in the trees.",
    questions: [
      { q: "What did the class make?", options: ["Some signs", "A new bridge", "A school garden", "A bird house"], answer: "Some signs", explain: "文中说他们做了一些标识牌放在河边。" },
      { q: "What happened after that?", options: ["Fish came back", "The river dried up", "The school moved", "People left"], answer: "Fish came back", explain: "最后一句说鱼回来了，鸟在树上唱歌。" },
    ],
  },
];


/* ===== 教材二：2024 秋人教版 PEP（三至六年级）===== */
const UNITS_PEP = [
  {"id": 11, "label": "1年级上", "en": "Grade 1A", "zh": "启蒙与基础认知"},
  {"id": 12, "label": "1年级下", "en": "Grade 1B", "zh": "家庭、食物与玩具"},
  {"id": 21, "label": "2年级上", "en": "Grade 2A", "zh": "动作、天气与时间"},
  {"id": 22, "label": "2年级下", "en": "Grade 2B", "zh": "交通、节日与日常"},
  {"id": 31, "label": "3年级上", "en": "Grade 3A", "zh": "社交、自然与多彩世界"},
  {"id": 32, "label": "3年级下", "en": "Grade 3B", "zh": "校园生活与身体认知"},
  {"id": 41, "label": "4年级上", "en": "Grade 4A", "zh": "社区责任与天气季节"},
  {"id": 42, "label": "4年级下", "en": "Grade 4B", "zh": "课程、农场与出行"},
  {"id": 51, "label": "5年级上", "en": "Grade 5A", "zh": "情绪管理与健康习惯", "defaultUnit": true},
  {"id": 52, "label": "5年级下", "en": "Grade 5B", "zh": "规则意识与科技展望"},
  {"id": 61, "label": "6年级上", "en": "Grade 6A", "zh": "个人成长与宇宙资源"},
  {"id": 62, "label": "6年级下", "en": "Grade 6B", "zh": "中学准备与放飞梦想"},
];
const WORDS_PEP = [
  {"id": "pep11u1w01", "en": "book", "zh": "书", "unit": 11, "group": "主题词", "level": 1, "sent": "Please remember the word '____'.", "emoji": "📖"},
  {"id": "pep11u1w02", "en": "ruler", "zh": "尺子", "unit": 11, "group": "主题词", "level": 1, "sent": "Please remember the word '____'.", "emoji": "📏"},
  {"id": "pep11u1w03", "en": "pencil", "zh": "铅笔", "unit": 11, "group": "主题词", "level": 1, "sent": "Please remember the word '____'.", "emoji": "✏️"},
  {"id": "pep11u1w04", "en": "eraser", "zh": "橡皮", "unit": 11, "group": "主题词", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧽"},
  {"id": "pep11u1w05", "en": "schoolbag", "zh": "书包", "unit": 11, "group": "主题词", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎒"},
  {"id": "pep11u2w01", "en": "eye", "zh": "眼睛", "unit": 11, "group": "身体", "level": 1, "sent": "Please say '____' again.", "emoji": "👁️"},
  {"id": "pep11u2w02", "en": "ear", "zh": "耳朵", "unit": 11, "group": "身体", "level": 1, "sent": "Please say '____' again.", "emoji": "👂"},
  {"id": "pep11u2w03", "en": "nose", "zh": "鼻子", "unit": 11, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👃"},
  {"id": "pep11u2w04", "en": "mouth", "zh": "嘴", "unit": 11, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👄"},
  {"id": "pep11u2w05", "en": "face", "zh": "脸", "unit": 11, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "😀"},
  {"id": "pep11u3w01", "en": "cat", "zh": "猫", "unit": 11, "group": "动物", "level": 1, "sent": "My ____ is very cute.", "emoji": "🐱"},
  {"id": "pep11u3w02", "en": "dog", "zh": "狗", "unit": 11, "group": "动物", "level": 1, "sent": "My ____ has big eyes.", "emoji": "🐶"},
  {"id": "pep11u3w03", "en": "bird", "zh": "鸟", "unit": 11, "group": "动物", "level": 1, "sent": "The ____ can fly.", "emoji": "🐦"},
  {"id": "pep11u3w04", "en": "monkey", "zh": "猴子", "unit": 11, "group": "动物", "level": 1, "sent": "The ____ can jump.", "emoji": "🐒"},
  {"id": "pep11u3w05", "en": "tiger", "zh": "老虎", "unit": 11, "group": "动物", "level": 1, "sent": "The ____ is big.", "emoji": "🐯"},
  {"id": "pep11u4w01", "en": "one", "zh": "一", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "1️⃣"},
  {"id": "pep11u4w02", "en": "two", "zh": "二", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "2️⃣"},
  {"id": "pep11u4w03", "en": "three", "zh": "三", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "3️⃣"},
  {"id": "pep11u4w04", "en": "four", "zh": "四", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "4️⃣"},
  {"id": "pep11u4w05", "en": "five", "zh": "五", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "5️⃣"},
  {"id": "pep11u4w06", "en": "six", "zh": "六", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "6️⃣"},
  {"id": "pep11u4w07", "en": "seven", "zh": "七", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "7️⃣"},
  {"id": "pep11u4w08", "en": "eight", "zh": "八", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "8️⃣"},
  {"id": "pep11u4w09", "en": "nine", "zh": "九", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "9️⃣"},
  {"id": "pep11u4w10", "en": "ten", "zh": "十", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔟"},
  {"id": "pep11u5w01", "en": "red", "zh": "红色", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔴"},
  {"id": "pep11u5w02", "en": "blue", "zh": "蓝色", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔵"},
  {"id": "pep11u5w03", "en": "yellow", "zh": "黄色", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🟡"},
  {"id": "pep11u5w04", "en": "green", "zh": "绿色", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🟢"},
  {"id": "pep11u5w05", "en": "colour", "zh": "颜色", "unit": 11, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎨"},
  {"id": "pep12u1w01", "en": "bed", "zh": "床", "unit": 12, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🛏️"},
  {"id": "pep12u1w02", "en": "desk", "zh": "书桌", "unit": 12, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🪑"},
  {"id": "pep12u1w03", "en": "chair", "zh": "椅子", "unit": 12, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🪑"},
  {"id": "pep12u1w04", "en": "room", "zh": "房间", "unit": 12, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚪"},
  {"id": "pep12u1w05", "en": "table", "zh": "桌子", "unit": 12, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🪑"},
  {"id": "pep12u2w01", "en": "father", "zh": "爸爸", "unit": 12, "group": "人与家庭", "level": 1, "sent": "He is my ____.", "emoji": "👨"},
  {"id": "pep12u2w02", "en": "mother", "zh": "妈妈", "unit": 12, "group": "人与家庭", "level": 1, "sent": "This is my ____.", "emoji": "👩"},
  {"id": "pep12u2w03", "en": "brother", "zh": "兄弟", "unit": 12, "group": "人与家庭", "level": 1, "sent": "He is my ____.", "emoji": "👦"},
  {"id": "pep12u2w04", "en": "sister", "zh": "姐妹", "unit": 12, "group": "人与家庭", "level": 1, "sent": "She is my ____.", "emoji": "👧"},
  {"id": "pep12u2w05", "en": "me", "zh": "我", "unit": 12, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'."},
  {"id": "pep12u3w01", "en": "apple", "zh": "苹果", "unit": 12, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍎"},
  {"id": "pep12u3w02", "en": "pear", "zh": "梨", "unit": 12, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍐"},
  {"id": "pep12u3w03", "en": "banana", "zh": "香蕉", "unit": 12, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍌"},
  {"id": "pep12u3w04", "en": "milk", "zh": "牛奶", "unit": 12, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🥛"},
  {"id": "pep12u3w05", "en": "water", "zh": "水", "unit": 12, "group": "食物", "level": 1, "sent": "Please say '____' again.", "emoji": "💧"},
  {"id": "pep12u4w01", "en": "toy", "zh": "玩具", "unit": 12, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧸"},
  {"id": "pep12u4w02", "en": "ball", "zh": "球", "unit": 12, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "⚽"},
  {"id": "pep12u4w03", "en": "kite", "zh": "风筝", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🪁"},
  {"id": "pep12u4w04", "en": "car", "zh": "汽车", "unit": 12, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚗"},
  {"id": "pep12u4w05", "en": "bear", "zh": "玩具熊", "unit": 12, "group": "动物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🐻"},
  {"id": "pep12u5w01", "en": "shirt", "zh": "衬衫", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👔"},
  {"id": "pep12u5w02", "en": "skirt", "zh": "短裙", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👗"},
  {"id": "pep12u5w03", "en": "dress", "zh": "连衣裙", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👗"},
  {"id": "pep12u5w04", "en": "shoe", "zh": "鞋子", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👟"},
  {"id": "pep12u5w05", "en": "clothes", "zh": "衣服", "unit": 12, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👚"},
  {"id": "pep21u1w01", "en": "run", "zh": "跑", "unit": 21, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏃"},
  {"id": "pep21u1w02", "en": "jump", "zh": "跳", "unit": 21, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🤸"},
  {"id": "pep21u1w03", "en": "swim", "zh": "游泳", "unit": 21, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏊"},
  {"id": "pep21u1w04", "en": "sing", "zh": "唱", "unit": 21, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎤"},
  {"id": "pep21u1w05", "en": "dance", "zh": "跳舞", "unit": 21, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "💃"},
  {"id": "pep21u2w01", "en": "weather", "zh": "天气", "unit": 21, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌤️"},
  {"id": "pep21u2w02", "en": "sun", "zh": "太阳", "unit": 21, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "☀️"},
  {"id": "pep21u2w03", "en": "rain", "zh": "雨", "unit": 21, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌧️"},
  {"id": "pep21u2w04", "en": "wind", "zh": "风", "unit": 21, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌬️"},
  {"id": "pep21u2w05", "en": "snow", "zh": "雪", "unit": 21, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "❄️"},
  {"id": "pep21u3w01", "en": "time", "zh": "时间", "unit": 21, "group": "时间", "level": 1, "sent": "Please remember the word '____'.", "emoji": "⏰"},
  {"id": "pep21u3w02", "en": "clock", "zh": "钟表", "unit": 21, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🕐"},
  {"id": "pep21u3w03", "en": "morning", "zh": "早上", "unit": 21, "group": "时间", "level": 1, "sent": "Good ____, class.", "emoji": "🌅"},
  {"id": "pep21u3w04", "en": "afternoon", "zh": "下午", "unit": 21, "group": "时间", "level": 1, "sent": "Please say '____' again.", "emoji": "🌇"},
  {"id": "pep21u3w05", "en": "night", "zh": "夜晚", "unit": 21, "group": "时间", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌙"},
  {"id": "pep21u4w01", "en": "friend", "zh": "朋友", "unit": 21, "group": "人与家庭", "level": 1, "sent": "This is my new ____.", "emoji": "🧑‍🤝‍🧑"},
  {"id": "pep21u4w02", "en": "tall", "zh": "高的", "unit": 21, "group": "人与家庭", "level": 1, "sent": "Ben is ____, and Sam is a little shorter.", "emoji": "🦒"},
  {"id": "pep21u4w03", "en": "short", "zh": "矮的/短的", "unit": 21, "group": "人与家庭", "level": 1, "sent": "Please say '____' again.", "emoji": "🐹"},
  {"id": "pep21u4w04", "en": "big", "zh": "大的", "unit": 21, "group": "人与家庭", "level": 1, "sent": "My family is ____."},
  {"id": "pep21u4w05", "en": "small", "zh": "小的", "unit": 21, "group": "人与家庭", "level": 1, "sent": "We live in a ____ home."},
  {"id": "pep21u5w01", "en": "park", "zh": "公园", "unit": 21, "group": "地点方位", "level": 1, "sent": "I live in an apartment near the ____.", "emoji": "🌳"},
  {"id": "pep21u5w02", "en": "tree", "zh": "树", "unit": 21, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌳"},
  {"id": "pep21u5w03", "en": "flower", "zh": "花", "unit": 21, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌸"},
  {"id": "pep21u5w04", "en": "grass", "zh": "草", "unit": 21, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌿"},
  {"id": "pep21u5w05", "en": "lake", "zh": "湖", "unit": 21, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏞️"},
  {"id": "pep22u1w01", "en": "bus", "zh": "公交车", "unit": 22, "group": "交通出行", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚌"},
  {"id": "pep22u1w02", "en": "train", "zh": "火车", "unit": 22, "group": "交通出行", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚆"},
  {"id": "pep22u1w03", "en": "plane", "zh": "飞机", "unit": 22, "group": "交通出行", "level": 1, "sent": "Please remember the word '____'.", "emoji": "✈️"},
  {"id": "pep22u1w04", "en": "bike", "zh": "自行车", "unit": 22, "group": "交通出行", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚲"},
  {"id": "pep22u1w05", "en": "ship", "zh": "船", "unit": 22, "group": "交通出行", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚢"},
  {"id": "pep22u2w01", "en": "happy", "zh": "开心的", "unit": 22, "group": "情绪", "level": 1, "sent": "We are tired after practice, but we are ____ too.", "emoji": "😄"},
  {"id": "pep22u2w02", "en": "sad", "zh": "伤心的", "unit": 22, "group": "情绪", "level": 1, "sent": "He is ____ now, so let's sit with him for a while.", "emoji": "😢"},
  {"id": "pep22u2w03", "en": "hot", "zh": "热的", "unit": 22, "group": "情绪", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🥵"},
  {"id": "pep22u2w04", "en": "cold", "zh": "冷的", "unit": 22, "group": "情绪", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🥶"},
  {"id": "pep22u2w05", "en": "tired", "zh": "累的", "unit": 22, "group": "情绪", "level": 1, "sent": "We are ____ after practice, but we are happy too.", "emoji": "🥱"},
  {"id": "pep22u3w01", "en": "festival", "zh": "节日", "unit": 22, "group": "季节节日", "level": 1, "sent": "Please say '____' again.", "emoji": "🎉"},
  {"id": "pep22u3w02", "en": "New Year", "zh": "新年", "unit": 22, "group": "季节节日", "level": 1, "sent": "Please remember the word '____'."},
  {"id": "pep22u3w03", "en": "gift", "zh": "礼物", "unit": 22, "group": "季节节日", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎁"},
  {"id": "pep22u3w04", "en": "card", "zh": "贺卡", "unit": 22, "group": "季节节日", "level": 1, "sent": "Please remember the word '____'.", "emoji": "💌"},
  {"id": "pep22u3w05", "en": "party", "zh": "派对", "unit": 22, "group": "季节节日", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎉"},
  {"id": "pep22u4w01", "en": "get up", "zh": "起床", "unit": 22, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌅"},
  {"id": "pep22u4w02", "en": "eat", "zh": "吃", "unit": 22, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍽️"},
  {"id": "pep22u4w03", "en": "drink", "zh": "喝", "unit": 22, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🥤"},
  {"id": "pep22u4w04", "en": "play", "zh": "玩", "unit": 22, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎮"},
  {"id": "pep22u4w05", "en": "sleep", "zh": "睡觉", "unit": 22, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "😴"},
  {"id": "pep22u5w01", "en": "zoo", "zh": "动物园", "unit": 22, "group": "动物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🦁"},
  {"id": "pep22u5w02", "en": "school", "zh": "学校", "unit": 22, "group": "校园场所", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏫"},
  {"id": "pep22u5w03", "en": "shop", "zh": "商店", "unit": 22, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏬"},
  {"id": "pep22u5w04", "en": "hospital", "zh": "医院", "unit": 22, "group": "地点方位", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏥"},
  {"id": "pep22u5w05", "en": "home", "zh": "家", "unit": 22, "group": "地点方位", "level": 1, "sent": "We are at ____.", "emoji": "🏠"},
  {"id": "pep31u1w01", "en": "greet", "zh": "打招呼", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👋"},
  {"id": "pep31u1w01", "en": "hello", "zh": "你好", "unit": 31, "group": "人与家庭", "level": 1, "sent": "____! I am Tim.", "emoji": "👋"},
  {"id": "pep31u1w02", "en": "smile", "zh": "微笑", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Her ____ is warm and bright.", "emoji": "😊"},
  {"id": "pep31u1w02", "en": "hi", "zh": "嗨；你好", "unit": 31, "group": "人与家庭", "level": 1, "sent": "____, my name is Anna.", "emoji": "👋"},
  {"id": "pep31u1w03", "en": "share", "zh": "分享", "unit": 31, "group": "人与家庭", "level": 1, "sent": "We ____ pencils and storybooks.", "emoji": "🤝"},
  {"id": "pep31u1w03", "en": "good", "zh": "好的", "unit": 31, "group": "人与家庭", "level": 1, "sent": "____ morning, class."},
  {"id": "pep31u1w04", "en": "listen", "zh": "听", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Let’s ____ together.", "emoji": "👂"},
  {"id": "pep31u1w04", "en": "morning", "zh": "早晨", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Good ____, class.", "emoji": "🌅"},
  {"id": "pep31u1w05", "en": "help", "zh": "帮助", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Can you ____ me with this word?", "emoji": "🤝"},
  {"id": "pep31u1w05", "en": "afternoon", "zh": "下午", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please say '____' again.", "emoji": "🌇"},
  {"id": "pep31u1w06", "en": "name", "zh": "名字", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Hi, my ____ is Anna.", "emoji": "🪪"},
  {"id": "pep31u1w07", "en": "friend", "zh": "朋友", "unit": 31, "group": "人与家庭", "level": 1, "sent": "This is my new ____.", "emoji": "🧑‍🤝‍🧑"},
  {"id": "pep31u1w08", "en": "meet", "zh": "遇见；认识", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Nice to ____ you, Lucy."},
  {"id": "pep31u1w09", "en": "new", "zh": "新的", "unit": 31, "group": "人与家庭", "level": 1, "sent": "This is my ____ friend."},
  {"id": "pep31u1w10", "en": "class", "zh": "班级；课", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Good morning, ____."},
  {"id": "pep31u1w11", "en": "boy", "zh": "男孩", "unit": 31, "group": "人与家庭", "level": 1, "sent": "The ____ is in my class.", "emoji": "👦"},
  {"id": "pep31u1w12", "en": "girl", "zh": "女孩", "unit": 31, "group": "人与家庭", "level": 1, "sent": "The ____ says hello to me.", "emoji": "👧"},
  {"id": "pep31u2w01", "en": "grandfather", "zh": "爷爷/外公", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👴"},
  {"id": "pep31u2w02", "en": "grandmother", "zh": "奶奶/外婆", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👵"},
  {"id": "pep31u2w02", "en": "father", "zh": "父亲", "unit": 31, "group": "人与家庭", "level": 1, "sent": "He is my ____.", "emoji": "👨"},
  {"id": "pep31u2w03", "en": "cousin", "zh": "表兄妹", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👧"},
  {"id": "pep31u2w03", "en": "mother", "zh": "母亲", "unit": 31, "group": "人与家庭", "level": 1, "sent": "This is my ____.", "emoji": "👩"},
  {"id": "pep31u2w04", "en": "family", "zh": "家庭", "unit": 31, "group": "人与家庭", "level": 1, "sent": "My ____ is big.", "emoji": "👪"},
  {"id": "pep31u2w04", "en": "brother", "zh": "兄弟", "unit": 31, "group": "人与家庭", "level": 1, "sent": "He is my ____.", "emoji": "👦"},
  {"id": "pep31u2w05", "en": "together", "zh": "一起", "unit": 31, "group": "人与家庭", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🤝"},
  {"id": "pep31u2w05", "en": "sister", "zh": "姐妹", "unit": 31, "group": "人与家庭", "level": 1, "sent": "She is my ____.", "emoji": "👧"},
  {"id": "pep31u2w06", "en": "grandpa", "zh": "爷爷；外公", "unit": 31, "group": "人与家庭", "level": 1, "sent": "My ____ likes tea.", "emoji": "👴"},
  {"id": "pep31u2w07", "en": "grandma", "zh": "奶奶；外婆", "unit": 31, "group": "人与家庭", "level": 1, "sent": "I love my ____.", "emoji": "👵"},
  {"id": "pep31u2w08", "en": "baby", "zh": "婴儿", "unit": 31, "group": "人与家庭", "level": 1, "sent": "This is my ____ sister."},
  {"id": "pep31u2w09", "en": "big", "zh": "大的", "unit": 31, "group": "人与家庭", "level": 1, "sent": "My family is ____."},
  {"id": "pep31u2w10", "en": "small", "zh": "小的", "unit": 31, "group": "人与家庭", "level": 1, "sent": "We live in a ____ home."},
  {"id": "pep31u2w11", "en": "love", "zh": "爱", "unit": 31, "group": "人与家庭", "level": 1, "sent": "I ____ my grandma."},
  {"id": "pep31u2w12", "en": "home", "zh": "家", "unit": 31, "group": "人与家庭", "level": 1, "sent": "We are at ____.", "emoji": "🏠"},
  {"id": "pep31u3w01", "en": "panda", "zh": "熊猫", "unit": 31, "group": "动物", "level": 1, "sent": "It is a ____.", "emoji": "🐼"},
  {"id": "pep31u3w02", "en": "elephant", "zh": "大象", "unit": 31, "group": "动物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🐘"},
  {"id": "pep31u3w03", "en": "pet", "zh": "宠物", "unit": 31, "group": "动物", "level": 1, "sent": "Do you have a ____ at home?", "emoji": "🐾"},
  {"id": "pep31u3w03", "en": "monkey", "zh": "猴子", "unit": 31, "group": "动物", "level": 1, "sent": "The ____ can jump.", "emoji": "🐒"},
  {"id": "pep31u3w04", "en": "animal", "zh": "动物", "unit": 31, "group": "动物", "level": 1, "sent": "This ____ is funny.", "emoji": "🐾"},
  {"id": "pep31u3w04", "en": "bird", "zh": "鸟", "unit": 31, "group": "动物", "level": 1, "sent": "The ____ can fly.", "emoji": "🐦"},
  {"id": "pep31u3w05", "en": "cute", "zh": "可爱的", "unit": 31, "group": "外貌品质", "level": 1, "sent": "The bird is small and ____."},
  {"id": "pep31u3w05", "en": "fish", "zh": "鱼", "unit": 31, "group": "动物", "level": 1, "sent": "The ____ can swim.", "emoji": "🐟"},
  {"id": "pep31u3w06", "en": "rabbit", "zh": "兔子", "unit": 31, "group": "动物", "level": 1, "sent": "The ____ has long ears.", "emoji": "🐰"},
  {"id": "pep31u3w07", "en": "tiger", "zh": "老虎", "unit": 31, "group": "动物", "level": 1, "sent": "The ____ is big.", "emoji": "🐯"},
  {"id": "pep31u4w01", "en": "plant", "zh": "植物", "unit": 31, "group": "植物自然", "level": 1, "sent": "Please say '____' again.", "emoji": "🌱"},
  {"id": "pep31u4w02", "en": "leaf", "zh": "树叶", "unit": 31, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍃"},
  {"id": "pep31u4w03", "en": "water", "zh": "浇水/水", "unit": 31, "group": "植物自然", "level": 1, "sent": "Please say '____' again.", "emoji": "💧"},
  {"id": "pep31u4w04", "en": "grow", "zh": "生长", "unit": 31, "group": "植物自然", "level": 1, "sent": "Please say '____' again.", "emoji": "🌱"},
  {"id": "pep31u4w05", "en": "sun", "zh": "太阳", "unit": 31, "group": "植物自然", "level": 1, "sent": "Please remember the word '____'.", "emoji": "☀️"},
  {"id": "pep31u5w01", "en": "black", "zh": "黑色", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "⚫"},
  {"id": "pep31u5w02", "en": "white", "zh": "白色", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "⚪"},
  {"id": "pep31u5w03", "en": "orange", "zh": "橙色", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🟠"},
  {"id": "pep31u5w04", "en": "brown", "zh": "棕色", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🟤"},
  {"id": "pep31u5w05", "en": "colourful", "zh": "多彩的", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌈"},
  {"id": "pep31u6w01", "en": "number", "zh": "数字", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔢"},
  {"id": "pep31u6w02", "en": "age", "zh": "年龄", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎂"},
  {"id": "pep31u6w03", "en": "birthday", "zh": "生日", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎂"},
  {"id": "pep31u6w04", "en": "eleven", "zh": "十一", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔢"},
  {"id": "pep31u6w05", "en": "twelve", "zh": "十二", "unit": 31, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🔢"},
  {"id": "pep32u1w01", "en": "classroom", "zh": "教室", "unit": 32, "group": "校园场所", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🏫"},
  {"id": "pep32u1w01", "en": "hello", "zh": "你好", "unit": 32, "group": "人与家庭", "level": 1, "sent": "____! My name is Leo.", "emoji": "👋"},
  {"id": "pep32u1w02", "en": "library", "zh": "图书馆", "unit": 32, "group": "校园场所", "level": 1, "sent": "You shouldn't eat in the ____.", "emoji": "📚"},
  {"id": "pep32u1w02", "en": "hi", "zh": "嗨", "unit": 32, "group": "人与家庭", "level": 1, "sent": "____, I’m Anna from China.", "emoji": "👋"},
  {"id": "pep32u1w03", "en": "playground", "zh": "操场", "unit": 32, "group": "校园场所", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🛝"},
  {"id": "pep32u1w03", "en": "name", "zh": "名字", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Hello! My ____ is Leo.", "emoji": "🪪"},
  {"id": "pep32u1w04", "en": "teacher", "zh": "老师", "unit": 32, "group": "人与家庭", "level": 1, "sent": "My ____ says hello to us.", "emoji": "🧑‍🏫"},
  {"id": "pep32u1w04", "en": "from", "zh": "来自", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Hi, I’m Anna ____ China."},
  {"id": "pep32u1w05", "en": "student", "zh": "学生", "unit": 32, "group": "校园场所", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧑‍🎓"},
  {"id": "pep32u1w05", "en": "China", "zh": "中国", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Hi, I’m Anna from ____."},
  {"id": "pep32u1w06", "en": "Canada", "zh": "加拿大", "unit": 32, "group": "人与家庭", "level": 1, "sent": "I’m from ____."},
  {"id": "pep32u1w07", "en": "the UK", "zh": "英国", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Ben is from ____."},
  {"id": "pep32u1w08", "en": "the USA", "zh": "美国", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Please say '____' again."},
  {"id": "pep32u1w09", "en": "friend", "zh": "朋友", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Please say '____' again.", "emoji": "🧑‍🤝‍🧑"},
  {"id": "pep32u1w10", "en": "classmate", "zh": "同学", "unit": 32, "group": "人与家庭", "level": 1, "sent": "This is my new ____."},
  {"id": "pep32u1w11", "en": "new", "zh": "新的", "unit": 32, "group": "人与家庭", "level": 1, "sent": "This is my ____ classmate."},
  {"id": "pep32u1w12", "en": "meet", "zh": "认识；遇见", "unit": 32, "group": "人与家庭", "level": 1, "sent": "Nice to ____ you, Ms Green."},
  {"id": "pep32u2w01", "en": "body", "zh": "身体", "unit": 32, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧍"},
  {"id": "pep32u2w01", "en": "pet", "zh": "宠物", "unit": 32, "group": "主题词", "level": 1, "sent": "Do you have a ____ at home?"},
  {"id": "pep32u2w02", "en": "head", "zh": "头", "unit": 32, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧠"},
  {"id": "pep32u2w02", "en": "rabbit", "zh": "兔子", "unit": 32, "group": "动物", "level": 1, "sent": "I like my little ____.", "emoji": "🐰"},
  {"id": "pep32u2w03", "en": "arm", "zh": "胳膊", "unit": 32, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "💪"},
  {"id": "pep32u2w03", "en": "dog", "zh": "狗", "unit": 32, "group": "动物", "level": 1, "sent": "My ____ has big eyes.", "emoji": "🐶"},
  {"id": "pep32u2w04", "en": "hand", "zh": "手", "unit": 32, "group": "身体", "level": 1, "sent": "Tom raises his ____ before he speaks.", "emoji": "✋"},
  {"id": "pep32u2w04", "en": "cat", "zh": "猫", "unit": 32, "group": "动物", "level": 1, "sent": "My ____ is very cute.", "emoji": "🐱"},
  {"id": "pep32u2w05", "en": "leg", "zh": "腿", "unit": 32, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🦵"},
  {"id": "pep32u2w05", "en": "bird", "zh": "鸟", "unit": 32, "group": "动物", "level": 1, "sent": "The ____ is small and cute.", "emoji": "🐦"},
  {"id": "pep32u2w06", "en": "foot", "zh": "脚", "unit": 32, "group": "身体", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🦶"},
  {"id": "pep32u2w06", "en": "fish", "zh": "鱼", "unit": 32, "group": "动物", "level": 1, "sent": "I have a toy ____.", "emoji": "🐟"},
  {"id": "pep32u2w07", "en": "big", "zh": "大的", "unit": 32, "group": "主题词", "level": 1, "sent": "My dog has ____ eyes."},
  {"id": "pep32u2w08", "en": "small", "zh": "小的", "unit": 32, "group": "主题词", "level": 1, "sent": "The bird is ____ and cute."},
  {"id": "pep32u2w09", "en": "long", "zh": "长的", "unit": 32, "group": "主题词", "level": 1, "sent": "It has ____ ears."},
  {"id": "pep32u2w10", "en": "cute", "zh": "可爱的", "unit": 32, "group": "外貌品质", "level": 1, "sent": "The bird is small and ____."},
  {"id": "pep32u2w11", "en": "eye", "zh": "眼睛", "unit": 32, "group": "身体", "level": 1, "sent": "Please say '____' again.", "emoji": "👁️"},
  {"id": "pep32u2w12", "en": "ear", "zh": "耳朵", "unit": 32, "group": "身体", "level": 1, "sent": "Please say '____' again.", "emoji": "👂"},
  {"id": "pep32u2w13", "en": "have", "zh": "有", "unit": 32, "group": "主题词", "level": 1, "sent": "Do you ____ a pet at home?"},
  {"id": "pep32u3w01", "en": "eat", "zh": "吃", "unit": 32, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍽️"},
  {"id": "pep32u3w01", "en": "read", "zh": "读", "unit": 32, "group": "校园场所", "level": 1, "sent": "Please ____ the short story.", "emoji": "📖"},
  {"id": "pep32u3w02", "en": "drink", "zh": "喝", "unit": 32, "group": "日常动作", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🥤"},
  {"id": "pep32u3w02", "en": "write", "zh": "写", "unit": 32, "group": "校园场所", "level": 1, "sent": "I can ____ my name well.", "emoji": "✍️"},
  {"id": "pep32u3w03", "en": "orange", "zh": "橙子", "unit": 32, "group": "颜色数字", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🟠"},
  {"id": "pep32u3w03", "en": "listen", "zh": "听", "unit": 32, "group": "校园场所", "level": 1, "sent": "Let’s ____ together.", "emoji": "👂"},
  {"id": "pep32u3w04", "en": "juice", "zh": "果汁", "unit": 32, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧃"},
  {"id": "pep32u3w04", "en": "ask", "zh": "问", "unit": 32, "group": "校园场所", "level": 1, "sent": "____ your teacher for help."},
  {"id": "pep32u3w05", "en": "bread", "zh": "面包", "unit": 32, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍞"},
  {"id": "pep32u3w05", "en": "answer", "zh": "回答", "unit": 32, "group": "校园场所", "level": 1, "sent": "Please say '____' again."},
  {"id": "pep32u3w06", "en": "rice", "zh": "米饭", "unit": 32, "group": "食物", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🍚"},
  {"id": "pep32u3w06", "en": "help", "zh": "帮助", "unit": 32, "group": "校园场所", "level": 1, "sent": "Can you ____ me with this word?"},
  {"id": "pep32u4w01", "en": "trousers", "zh": "裤子", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "👖"},
  {"id": "pep32u4w02", "en": "hat", "zh": "帽子", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎩"},
  {"id": "pep32u4w03", "en": "wear", "zh": "穿戴", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🧥"},
  {"id": "pep32u4w04", "en": "warm", "zh": "温暖的", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌤️"},
  {"id": "pep32u5w01", "en": "doll", "zh": "洋娃娃", "unit": 32, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🪆"},
  {"id": "pep32u5w02", "en": "bike", "zh": "自行车", "unit": 32, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🚲"},
  {"id": "pep32u5w03", "en": "game", "zh": "游戏", "unit": 32, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎮"},
  {"id": "pep32u5w04", "en": "play", "zh": "玩耍", "unit": 32, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎮"},
  {"id": "pep32u5w05", "en": "fun", "zh": "乐趣", "unit": 32, "group": "运动娱乐", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🎉"},
  {"id": "pep32u6w01", "en": "spring", "zh": "春天", "unit": 32, "group": "天气服饰", "level": 1, "sent": "In ____, the trees turn green.", "emoji": "🌸"},
  {"id": "pep32u6w02", "en": "summer", "zh": "夏天", "unit": 32, "group": "天气服饰", "level": 1, "sent": "____ is hot, but I like swimming.", "emoji": "☀️"},
  {"id": "pep32u6w03", "en": "autumn", "zh": "秋天", "unit": 32, "group": "天气服饰", "level": 1, "sent": "____ is a good season for hiking.", "emoji": "🍂"},
  {"id": "pep32u6w04", "en": "winter", "zh": "冬天", "unit": 32, "group": "天气服饰", "level": 1, "sent": "____ mornings can be very cold.", "emoji": "❄️"},
  {"id": "pep32u6w05", "en": "sunny", "zh": "晴朗的", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "☀️"},
  {"id": "pep32u6w06", "en": "rainy", "zh": "下雨的", "unit": 32, "group": "天气服饰", "level": 1, "sent": "Please remember the word '____'.", "emoji": "🌧️"},
  {"id": "pep41u1w01", "en": "clean", "zh": "打扫", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧹"},
  {"id": "pep41u1w02", "en": "wash", "zh": "洗", "unit": 41, "group": "地点方位", "level": 2, "sent": "Can you help me ____ the cups?", "emoji": "🧼"},
  {"id": "pep41u1w02", "en": "mop", "zh": "拖地", "unit": 41, "group": "人与家庭", "level": 2, "sent": "I often ____ the floor with my mum."},
  {"id": "pep41u1w03", "en": "sweep", "zh": "扫地", "unit": 41, "group": "地点方位", "level": 2, "sent": "I can ____ the floor after dinner.", "emoji": "🧹"},
  {"id": "pep41u1w03", "en": "tidy", "zh": "整理；整洁的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "We ____ the living room before guests come."},
  {"id": "pep41u1w04", "en": "cook", "zh": "做饭", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👨‍🍳"},
  {"id": "pep41u1w05", "en": "bedroom", "zh": "卧室", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🛏️"},
  {"id": "pep41u1w05", "en": "fold", "zh": "折叠", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep41u1w06", "en": "kitchen", "zh": "厨房", "unit": 41, "group": "地点方位", "level": 2, "sent": "The ____ is clean and bright.", "emoji": "🍳"},
  {"id": "pep41u1w06", "en": "set the table", "zh": "摆餐具", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Let's ____ together."},
  {"id": "pep41u1w07", "en": "housework", "zh": "家务", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧹"},
  {"id": "pep41u1w07", "en": "water the plants", "zh": "给植物浇水", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "💧"},
  {"id": "pep41u1w09", "en": "living room", "zh": "客厅", "unit": 41, "group": "人与家庭", "level": 2, "sent": "We tidy the ____ before guests come."},
  {"id": "pep41u1w10", "en": "weekend", "zh": "周末", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🗓️"},
  {"id": "pep41u1w11", "en": "helpful", "zh": "乐于帮助的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Tom is ____ at home.", "emoji": "🧹"},
  {"id": "pep41u1w12", "en": "laundry", "zh": "要洗的衣物", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Dad folds the ____ on Sunday evening."},
  {"id": "pep41u2w01", "en": "strong", "zh": "强壮的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "💪"},
  {"id": "pep41u2w01", "en": "friend", "zh": "朋友", "unit": 41, "group": "人与家庭", "level": 2, "sent": "This is my ____ Amy.", "emoji": "🧑‍🤝‍🧑"},
  {"id": "pep41u2w02", "en": "quiet", "zh": "文静的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "My best friend is ____ in class.", "emoji": "🤫"},
  {"id": "pep41u2w02", "en": "classmate", "zh": "同学", "unit": 41, "group": "人与家庭", "level": 2, "sent": "My ____ likes drawing after school."},
  {"id": "pep41u2w03", "en": "friendly", "zh": "友好的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "She is ____ and kind.", "emoji": "🤝"},
  {"id": "pep41u2w04", "en": "hair", "zh": "头发", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💇"},
  {"id": "pep41u2w04", "en": "kind", "zh": "善良的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "She is friendly and ____.", "emoji": "🤗"},
  {"id": "pep41u2w05", "en": "glasses", "zh": "眼镜", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Leo has curly hair and ____.", "emoji": "👓"},
  {"id": "pep41u2w05", "en": "funny", "zh": "有趣的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Ben is ____, but he is also helpful.", "emoji": "🤣"},
  {"id": "pep41u2w07", "en": "curly", "zh": "卷曲的", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Leo has ____ hair and glasses."},
  {"id": "pep41u2w09", "en": "hobby", "zh": "爱好", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep41u2w10", "en": "draw", "zh": "画画", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "✏️"},
  {"id": "pep41u2w11", "en": "share", "zh": "分享", "unit": 41, "group": "人与家庭", "level": 2, "sent": "We ____ pencils and storybooks."},
  {"id": "pep41u2w12", "en": "smile", "zh": "微笑", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Her ____ is warm and bright."},
  {"id": "pep41u3w01", "en": "community", "zh": "社区", "unit": 41, "group": "地点方位", "level": 2, "sent": "Our ____ has a notice board by the gate.", "emoji": "🏘️"},
  {"id": "pep41u3w01", "en": "apartment", "zh": "公寓", "unit": 41, "group": "主题词", "level": 2, "sent": "I live in an ____ near the park."},
  {"id": "pep41u3w02", "en": "street", "zh": "街道", "unit": 41, "group": "地点方位", "level": 2, "sent": "Our ____ is quiet at night.", "emoji": "🛣️"},
  {"id": "pep41u3w02", "en": "building", "zh": "楼房", "unit": 41, "group": "主题词", "level": 2, "sent": "There is a supermarket beside my ____."},
  {"id": "pep41u3w03", "en": "near", "zh": "附近", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "📍"},
  {"id": "pep41u3w04", "en": "far", "zh": "遥远", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌐"},
  {"id": "pep41u3w04", "en": "floor", "zh": "楼层", "unit": 41, "group": "主题词", "level": 2, "sent": "My grandparents live on the third ____."},
  {"id": "pep41u3w05", "en": "live", "zh": "居住", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏠"},
  {"id": "pep41u3w05", "en": "garden", "zh": "花园", "unit": 41, "group": "植物自然", "level": 2, "sent": "We play in the ____ after school."},
  {"id": "pep41u3w06", "en": "neighbour", "zh": "邻居", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🏘️"},
  {"id": "pep41u3w06", "en": "park", "zh": "公园", "unit": 41, "group": "地点方位", "level": 2, "sent": "I live in an apartment near the ____.", "emoji": "🌳"},
  {"id": "pep41u3w07", "en": "supermarket", "zh": "超市", "unit": 41, "group": "主题词", "level": 2, "sent": "There is a ____ beside my building."},
  {"id": "pep41u3w08", "en": "beside", "zh": "在……旁边", "unit": 41, "group": "地点方位", "level": 2, "sent": "There is a supermarket ____ my building."},
  {"id": "pep41u4w01", "en": "job", "zh": "工作", "unit": 41, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💼"},
  {"id": "pep41u4w02", "en": "worker", "zh": "工人", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👷"},
  {"id": "pep41u4w03", "en": "doctor", "zh": "医生", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🩺"},
  {"id": "pep41u4w04", "en": "nurse", "zh": "护士", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧑‍⚕️"},
  {"id": "pep41u4w05", "en": "driver", "zh": "司机", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧑‍✈️"},
  {"id": "pep41u4w06", "en": "farmer", "zh": "农民", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧑‍🌾"},
  {"id": "pep41u4w07", "en": "police", "zh": "警察", "unit": 41, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👮"},
  {"id": "pep41u5w01", "en": "windy", "zh": "刮风的", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌬️"},
  {"id": "pep41u5w02", "en": "cloudy", "zh": "多云的", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "☁️"},
  {"id": "pep41u5w03", "en": "snowy", "zh": "下雪的", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "❄️"},
  {"id": "pep41u5w04", "en": "cool", "zh": "凉爽的", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🍃"},
  {"id": "pep41u5w05", "en": "umbrella", "zh": "雨伞", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "☂️"},
  {"id": "pep41u6w01", "en": "season", "zh": "季节", "unit": 41, "group": "季节节日", "level": 2, "sent": "Autumn is a good ____ for hiking.", "emoji": "🍂"},
  {"id": "pep41u6w02", "en": "change", "zh": "改变", "unit": 41, "group": "季节节日", "level": 2, "sent": "Please say '____' again.", "emoji": "🔄"},
  {"id": "pep41u6w03", "en": "travel", "zh": "旅行", "unit": 41, "group": "季节节日", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧳"},
  {"id": "pep41u6w04", "en": "vacation", "zh": "假期", "unit": 41, "group": "季节节日", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏖️"},
  {"id": "pep41u6w05", "en": "wear", "zh": "穿着", "unit": 41, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧥"},
  {"id": "pep42u1w01", "en": "class", "zh": "课程", "unit": 42, "group": "校园场所", "level": 2, "sent": "Good morning, ____.", "emoji": "📚"},
  {"id": "pep42u1w01", "en": "rule", "zh": "规则", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u1w02", "en": "subject", "zh": "学科", "unit": 42, "group": "主题词", "level": 2, "sent": "Please say '____' again.", "emoji": "📚"},
  {"id": "pep42u1w02", "en": "quiet", "zh": "安静的", "unit": 42, "group": "外貌品质", "level": 2, "sent": "The classroom is ____ during reading time.", "emoji": "🤫"},
  {"id": "pep42u1w03", "en": "English", "zh": "英语", "unit": 42, "group": "主题词", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u1w03", "en": "careful", "zh": "仔细的", "unit": 42, "group": "校园场所", "level": 2, "sent": "Our teacher asks us to be ____."},
  {"id": "pep42u1w04", "en": "maths", "zh": "数学", "unit": 42, "group": "主题词", "level": 2, "sent": "Please remember the word '____'.", "emoji": "➗"},
  {"id": "pep42u1w04", "en": "raise", "zh": "举起", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u1w05", "en": "music", "zh": "音乐", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎵"},
  {"id": "pep42u1w05", "en": "hand", "zh": "手", "unit": 42, "group": "校园场所", "level": 2, "sent": "Tom raises his ____ before he speaks.", "emoji": "✋"},
  {"id": "pep42u1w06", "en": "art", "zh": "美术", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎨"},
  {"id": "pep42u1w06", "en": "line up", "zh": "排队", "unit": 42, "group": "校园场所", "level": 2, "sent": "The children ____ after class."},
  {"id": "pep42u1w07", "en": "PE", "zh": "体育", "unit": 42, "group": "主题词", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u1w07", "en": "turn", "zh": "轮流；转动", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please wait for your ____."},
  {"id": "pep42u1w08", "en": "shout", "zh": "大喊", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u1w09", "en": "borrow", "zh": "借用", "unit": 42, "group": "校园场所", "level": 2, "sent": "Can I ____ your blue pen?"},
  {"id": "pep42u1w10", "en": "return", "zh": "归还", "unit": 42, "group": "校园场所", "level": 2, "sent": "I ____ the book to Anna after school."},
  {"id": "pep42u1w11", "en": "respect", "zh": "尊重", "unit": 42, "group": "校园场所", "level": 2, "sent": "We show ____ to everyone in class."},
  {"id": "pep42u1w12", "en": "permission", "zh": "允许", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w01", "en": "activity", "zh": "活动", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎨"},
  {"id": "pep42u2w01", "en": "tidy", "zh": "整理", "unit": 42, "group": "人与家庭", "level": 2, "sent": "I ____ my room every Saturday morning."},
  {"id": "pep42u2w02", "en": "sing", "zh": "唱歌", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎤"},
  {"id": "pep42u2w02", "en": "dish", "zh": "盘子；菜肴", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w03", "en": "draw", "zh": "画画", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again.", "emoji": "✏️"},
  {"id": "pep42u2w03", "en": "sweep", "zh": "打扫", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w04", "en": "read", "zh": "读书", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please ____ the short story.", "emoji": "📖"},
  {"id": "pep42u2w04", "en": "floor", "zh": "地板", "unit": 42, "group": "人与家庭", "level": 2, "sent": "My brother sweeps the ____ after dinner."},
  {"id": "pep42u2w05", "en": "swim", "zh": "游泳", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏊"},
  {"id": "pep42u2w05", "en": "plant", "zh": "植物", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🌱"},
  {"id": "pep42u2w06", "en": "sports", "zh": "运动", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⚽"},
  {"id": "pep42u2w06", "en": "water", "zh": "给……浇水", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "💧"},
  {"id": "pep42u2w07", "en": "set the table", "zh": "摆餐具", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w09", "en": "pet", "zh": "宠物", "unit": 42, "group": "人与家庭", "level": 2, "sent": "I feed my ____ rabbit every day."},
  {"id": "pep42u2w10", "en": "screen time", "zh": "看屏幕时间", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w11", "en": "responsibility", "zh": "责任", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u2w12", "en": "share", "zh": "分享；分担", "unit": 42, "group": "人与家庭", "level": 2, "sent": "We ____ the housework at home."},
  {"id": "pep42u3w01", "en": "farm", "zh": "农场", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚜"},
  {"id": "pep42u3w01", "en": "timetable", "zh": "时间表；课程表", "unit": 42, "group": "校园场所", "level": 2, "sent": "Our ____ is on the classroom wall."},
  {"id": "pep42u3w02", "en": "cow", "zh": "奶牛", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐄"},
  {"id": "pep42u3w02", "en": "quarter", "zh": "一刻钟", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u3w03", "en": "horse", "zh": "马", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐴"},
  {"id": "pep42u3w03", "en": "half", "zh": "一半；半点", "unit": 42, "group": "校园场所", "level": 2, "sent": "It's ____ past seven now."},
  {"id": "pep42u3w04", "en": "sheep", "zh": "绵羊", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐑"},
  {"id": "pep42u3w05", "en": "pig", "zh": "猪", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐷"},
  {"id": "pep42u3w05", "en": "assembly", "zh": "集会", "unit": 42, "group": "校园场所", "level": 2, "sent": "The ____ starts very early."},
  {"id": "pep42u3w06", "en": "hen", "zh": "母鸡", "unit": 42, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐔"},
  {"id": "pep42u3w06", "en": "break", "zh": "课间休息", "unit": 42, "group": "校园场所", "level": 2, "sent": "We have a ____ at ten."},
  {"id": "pep42u3w07", "en": "duck", "zh": "鸭子", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🦆"},
  {"id": "pep42u3w07", "en": "start", "zh": "开始", "unit": 42, "group": "校园场所", "level": 2, "sent": "I ____ school at eight o'clock."},
  {"id": "pep42u3w08", "en": "feed", "zh": "喂养", "unit": 42, "group": "动物", "level": 2, "sent": "I ____ my pet rabbit every day.", "emoji": "🥣"},
  {"id": "pep42u3w08", "en": "finish", "zh": "结束", "unit": 42, "group": "校园场所", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep42u4w01", "en": "travel", "zh": "旅行", "unit": 42, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧳"},
  {"id": "pep42u4w02", "en": "by", "zh": "乘(交通工具)", "unit": 42, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u4w03", "en": "station", "zh": "车站", "unit": 42, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚉"},
  {"id": "pep42u4w04", "en": "ticket", "zh": "车票", "unit": 42, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎫"},
  {"id": "pep42u4w05", "en": "fast", "zh": "快的", "unit": 42, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏃"},
  {"id": "pep42u5w01", "en": "weekend", "zh": "周末", "unit": 42, "group": "时间", "level": 2, "sent": "Please say '____' again.", "emoji": "🗓️"},
  {"id": "pep42u5w02", "en": "Saturday", "zh": "星期六", "unit": 42, "group": "颜色数字", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u5w03", "en": "Sunday", "zh": "星期日", "unit": 42, "group": "时间", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u5w04", "en": "shopping", "zh": "购物", "unit": 42, "group": "时间", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u5w05", "en": "visit", "zh": "拜访", "unit": 42, "group": "时间", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧳"},
  {"id": "pep42u6w01", "en": "lion", "zh": "狮子", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🦁"},
  {"id": "pep42u6w02", "en": "bear", "zh": "熊", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🐻"},
  {"id": "pep42u6w03", "en": "giraffe", "zh": "长颈鹿", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🦒"},
  {"id": "pep42u6w04", "en": "see", "zh": "看见", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep42u6w05", "en": "scary", "zh": "吓人的", "unit": 42, "group": "动物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👻"},
  {"id": "pep51u1w01", "en": "different", "zh": "不同的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔀"},
  {"id": "pep51u1w01", "en": "friendly", "zh": "友好的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "He is not loud, but he is very ____.", "emoji": "🤝"},
  {"id": "pep51u1w02", "en": "appearance", "zh": "外貌", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👤"},
  {"id": "pep51u1w02", "en": "quiet", "zh": "安静的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Mia is ____ in class, but she is active on the playground.", "emoji": "🤫"},
  {"id": "pep51u1w03", "en": "curly", "zh": "卷曲的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Who is the girl with ____ hair?", "emoji": "🌀"},
  {"id": "pep51u1w04", "en": "polite", "zh": "有礼貌的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "It's ____ to say 'Excuse me.'", "emoji": "🙇"},
  {"id": "pep51u1w05", "en": "clever", "zh": "聪明的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Our team needs ____ and active students.", "emoji": "💡"},
  {"id": "pep51u1w06", "en": "helpful", "zh": "乐于助人的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🧹"},
  {"id": "pep51u1w06", "en": "shy", "zh": "害羞的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "She is ____ at first, but soon she smiles and talks more.", "emoji": "😳"},
  {"id": "pep51u1w07", "en": "active", "zh": "活跃的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Mia is quiet in class, but she is ____ on the playground.", "emoji": "⚡"},
  {"id": "pep51u1w07", "en": "funny", "zh": "有趣的；滑稽的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "This is my friend Leo. He is ____ and kind.", "emoji": "🤣"},
  {"id": "pep51u1w08", "en": "trust", "zh": "信任", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🤝"},
  {"id": "pep51u1w08", "en": "strong", "zh": "强壮的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep51u1w09", "en": "hobby", "zh": "爱好", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🎨"},
  {"id": "pep51u1w09", "en": "tall", "zh": "高的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Ben is ____, and Sam is a little shorter.", "emoji": "🦒"},
  {"id": "pep51u1w10", "en": "short", "zh": "矮的；短的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please say '____' again.", "emoji": "🐹"},
  {"id": "pep51u1w12", "en": "straight", "zh": "直的", "unit": 51, "group": "人与家庭", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep51u1w13", "en": "glasses", "zh": "眼镜", "unit": 51, "group": "人与家庭", "level": 2, "sent": "The boy in ____ is my new classmate."},
  {"id": "pep51u1w14", "en": "classmate", "zh": "同班同学", "unit": 51, "group": "人与家庭", "level": 2, "sent": "The boy in glasses is my new ____."},
  {"id": "pep51u2w01", "en": "sad", "zh": "难过的", "unit": 51, "group": "情绪", "level": 2, "sent": "He is ____ now, so let's sit with him for a while.", "emoji": "😢"},
  {"id": "pep51u2w01", "en": "happy", "zh": "开心的", "unit": 51, "group": "情绪", "level": 2, "sent": "We are tired after practice, but we are ____ too.", "emoji": "😄"},
  {"id": "pep51u2w02", "en": "angry", "zh": "生气的", "unit": 51, "group": "情绪", "level": 2, "sent": "Please remember the word '____'.", "emoji": "😠"},
  {"id": "pep51u2w03", "en": "tired", "zh": "疲倦的", "unit": 51, "group": "情绪", "level": 2, "sent": "We are ____ after practice, but we are happy too.", "emoji": "🥱"},
  {"id": "pep51u2w04", "en": "scared", "zh": "害怕的", "unit": 51, "group": "情绪", "level": 2, "sent": "Are you ____ of dogs or just surprised?", "emoji": "😱"},
  {"id": "pep51u2w05", "en": "worried", "zh": "担心的", "unit": 51, "group": "情绪", "level": 2, "sent": "She looks ____ about her lost notebook.", "emoji": "😟"},
  {"id": "pep51u2w05", "en": "nervous", "zh": "紧张的", "unit": 51, "group": "情绪", "level": 2, "sent": "When I am ____, I take three deep breaths.", "emoji": "😬"},
  {"id": "pep51u2w06", "en": "excited", "zh": "兴奋的", "unit": 51, "group": "情绪", "level": 2, "sent": "I am ____ because our team won the game.", "emoji": "🤩"},
  {"id": "pep51u2w07", "en": "proud", "zh": "自豪的", "unit": 51, "group": "情绪", "level": 2, "sent": "My sister feels ____ when she finishes a hard puzzle.", "emoji": "😌"},
  {"id": "pep51u2w08", "en": "breathe", "zh": "呼吸", "unit": 51, "group": "情绪", "level": 2, "sent": "Please say '____' again.", "emoji": "🌬️"},
  {"id": "pep51u2w09", "en": "calm", "zh": "平静的", "unit": 51, "group": "情绪", "level": 2, "sent": "I feel ____ when I water the flowers.", "emoji": "🧘"},
  {"id": "pep51u2w09", "en": "bored", "zh": "无聊的", "unit": 51, "group": "情绪", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep51u2w10", "en": "surprised", "zh": "惊讶的", "unit": 51, "group": "情绪", "level": 2, "sent": "Are you scared of dogs or just ____?"},
  {"id": "pep51u2w14", "en": "smile", "zh": "微笑", "unit": 51, "group": "情绪", "level": 2, "sent": "You can ____ and ask for help."},
  {"id": "pep51u3w01", "en": "study", "zh": "学习", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'.", "emoji": "📚"},
  {"id": "pep51u3w02", "en": "homework", "zh": "作业", "unit": 51, "group": "日常动作", "level": 2, "sent": "I do my ____ first and then play outside.", "emoji": "📝"},
  {"id": "pep51u3w03", "en": "project", "zh": "项目", "unit": 51, "group": "日常动作", "level": 2, "sent": "Our science ____ is fun but not easy."},
  {"id": "pep51u3w03", "en": "practice", "zh": "练习", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep51u3w04", "en": "busy", "zh": "忙碌的", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep51u3w04", "en": "finish", "zh": "完成", "unit": 51, "group": "日常动作", "level": 2, "sent": "After I ____ reading, I draw for fun."},
  {"id": "pep51u3w05", "en": "relax", "zh": "放松", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please say '____' again.", "emoji": "🧘"},
  {"id": "pep51u3w06", "en": "chess", "zh": "国际象棋", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'.", "emoji": "♟️"},
  {"id": "pep51u3w07", "en": "instrument", "zh": "乐器", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎹"},
  {"id": "pep51u3w08", "en": "balance", "zh": "平衡", "unit": 51, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⚖️"},
  {"id": "pep51u3w09", "en": "schedule", "zh": "日程表", "unit": 51, "group": "人与家庭", "level": 2, "sent": "We need a simple ____ for the party.", "emoji": "📅"},
  {"id": "pep51u4w01", "en": "health", "zh": "健康", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "❤️"},
  {"id": "pep51u4w02", "en": "habit", "zh": "习惯", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please say '____' again.", "emoji": "✅"},
  {"id": "pep51u4w03", "en": "fit", "zh": "强健的", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💪"},
  {"id": "pep51u4w04", "en": "teeth", "zh": "牙齿", "unit": 51, "group": "身体", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🦷"},
  {"id": "pep51u4w05", "en": "always", "zh": "总是", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔁"},
  {"id": "pep51u4w06", "en": "usually", "zh": "通常", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔁"},
  {"id": "pep51u4w07", "en": "often", "zh": "经常", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔂"},
  {"id": "pep51u4w08", "en": "sometimes", "zh": "有时", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎲"},
  {"id": "pep51u4w09", "en": "seldom", "zh": "很少", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔽"},
  {"id": "pep51u4w10", "en": "never", "zh": "从不", "unit": 51, "group": "健康习惯", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚫"},
  {"id": "pep51u5w01", "en": "vegetable", "zh": "蔬菜", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🥦"},
  {"id": "pep51u5w02", "en": "fruit", "zh": "水果", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🍎"},
  {"id": "pep51u5w03", "en": "meat", "zh": "肉类", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🍖"},
  {"id": "pep51u5w04", "en": "grain", "zh": "谷物", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌾"},
  {"id": "pep51u5w05", "en": "energy", "zh": "能量", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⚡"},
  {"id": "pep51u5w06", "en": "sweet", "zh": "甜的", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🍬"},
  {"id": "pep51u5w07", "en": "salty", "zh": "咸的", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧂"},
  {"id": "pep51u5w08", "en": "fresh", "zh": "新鲜的", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🍃"},
  {"id": "pep51u5w09", "en": "bowl", "zh": "碗", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🥣"},
  {"id": "pep51u5w10", "en": "glass", "zh": "玻璃杯", "unit": 51, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🥛"},
  {"id": "pep51u6w01", "en": "nature", "zh": "自然", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌿"},
  {"id": "pep51u6w02", "en": "environment", "zh": "环境", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep51u6w03", "en": "forest", "zh": "森林", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌲"},
  {"id": "pep51u6w04", "en": "river", "zh": "河流", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏞️"},
  {"id": "pep51u6w05", "en": "mountain", "zh": "山", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⛰️"},
  {"id": "pep51u6w06", "en": "earth", "zh": "地球", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌍"},
  {"id": "pep51u6w07", "en": "protect", "zh": "保护", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🛡️"},
  {"id": "pep51u6w08", "en": "save", "zh": "节约", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💾"},
  {"id": "pep51u6w09", "en": "recycle", "zh": "回收", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "♻️"},
  {"id": "pep51u6w10", "en": "pollution", "zh": "污染", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏭"},
  {"id": "pep51u6w11", "en": "waste", "zh": "浪费/垃圾", "unit": 51, "group": "植物自然", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🗑️"},
  {"id": "pep52u1w01", "en": "yesterday", "zh": "昨天", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'.", "emoji": "📅"},
  {"id": "pep52u1w02", "en": "last", "zh": "刚过去的", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⏮️"},
  {"id": "pep52u1w02", "en": "follow", "zh": "遵守；跟随", "unit": 52, "group": "主题词", "level": 2, "sent": "Let's ____ the rules together."},
  {"id": "pep52u1w03", "en": "weekend", "zh": "周末", "unit": 52, "group": "时间", "level": 2, "sent": "Please say '____' again.", "emoji": "🗓️"},
  {"id": "pep52u1w03", "en": "quiet", "zh": "安静的", "unit": 52, "group": "外貌品质", "level": 2, "sent": "Please say '____' again.", "emoji": "🤫"},
  {"id": "pep52u1w04", "en": "went", "zh": "去(过去式)", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep52u1w04", "en": "hallway", "zh": "走廊", "unit": 52, "group": "主题词", "level": 2, "sent": "Keep the ____ safe and clean."},
  {"id": "pep52u1w05", "en": "saw", "zh": "看见(过去式)", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep52u1w05", "en": "line", "zh": "队伍", "unit": 52, "group": "主题词", "level": 2, "sent": "Children should stand in ____ after lunch."},
  {"id": "pep52u1w06", "en": "ate", "zh": "吃(过去式)", "unit": 52, "group": "日常动作", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep52u1w06", "en": "turn", "zh": "轮流；顺序", "unit": 52, "group": "主题词", "level": 2, "sent": "Please wait for your ____."},
  {"id": "pep52u1w07", "en": "had", "zh": "有(过去式)", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep52u1w07", "en": "polite", "zh": "有礼貌的", "unit": 52, "group": "外貌品质", "level": 2, "sent": "It's ____ to say 'Excuse me.'", "emoji": "🙇"},
  {"id": "pep52u1w08", "en": "memory", "zh": "记忆", "unit": 52, "group": "时间", "level": 2, "sent": "That ____ still makes me smile.", "emoji": "🧠"},
  {"id": "pep52u1w08", "en": "careful", "zh": "小心的", "unit": 52, "group": "主题词", "level": 2, "sent": "The floor is wet, so be ____."},
  {"id": "pep52u1w10", "en": "library", "zh": "图书馆", "unit": 52, "group": "校园场所", "level": 2, "sent": "You shouldn't eat in the ____.", "emoji": "📚"},
  {"id": "pep52u1w11", "en": "stairs", "zh": "楼梯", "unit": 52, "group": "主题词", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u1w12", "en": "respect", "zh": "尊重", "unit": 52, "group": "主题词", "level": 2, "sent": "____ others when you play games."},
  {"id": "pep52u2w01", "en": "holiday", "zh": "假日", "unit": 52, "group": "季节节日", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏖️"},
  {"id": "pep52u2w01", "en": "community", "zh": "社区", "unit": 52, "group": "主题词", "level": 2, "sent": "Our ____ has a notice board by the gate."},
  {"id": "pep52u2w02", "en": "festival", "zh": "节日", "unit": 52, "group": "季节节日", "level": 2, "sent": "Please say '____' again.", "emoji": "🎉"},
  {"id": "pep52u2w02", "en": "neighbour", "zh": "邻居", "unit": 52, "group": "主题词", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u2w03", "en": "mooncake", "zh": "月饼", "unit": 52, "group": "食物", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🥮"},
  {"id": "pep52u2w03", "en": "square", "zh": "广场", "unit": 52, "group": "主题词", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u2w04", "en": "lantern", "zh": "灯笼", "unit": 52, "group": "季节节日", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏮"},
  {"id": "pep52u2w04", "en": "garden", "zh": "花园", "unit": 52, "group": "植物自然", "level": 2, "sent": "There is a small ____ behind our building."},
  {"id": "pep52u2w05", "en": "celebrate", "zh": "庆祝", "unit": 52, "group": "季节节日", "level": 2, "sent": "Our class will ____ the end of the term together.", "emoji": "🎉"},
  {"id": "pep52u2w05", "en": "shopkeeper", "zh": "店主", "unit": 52, "group": "主题词", "level": 2, "sent": "The ____ knows many children in the area."},
  {"id": "pep52u2w06", "en": "traditional", "zh": "传统的", "unit": 52, "group": "季节节日", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏮"},
  {"id": "pep52u2w06", "en": "crosswalk", "zh": "人行横道", "unit": 52, "group": "主题词", "level": 2, "sent": "Use the ____ when you cross the road."},
  {"id": "pep52u2w07", "en": "traffic light", "zh": "红绿灯", "unit": 52, "group": "颜色数字", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u2w08", "en": "helpful", "zh": "乐于助人的", "unit": 52, "group": "外貌品质", "level": 2, "sent": "Please say '____' again.", "emoji": "🧹"},
  {"id": "pep52u2w09", "en": "clean-up", "zh": "清洁活动", "unit": 52, "group": "主题词", "level": 2, "sent": "Let's join the ____ this weekend.", "emoji": "🧹"},
  {"id": "pep52u2w10", "en": "notice board", "zh": "公告栏", "unit": 52, "group": "主题词", "level": 2, "sent": "Our community has a ____ by the gate."},
  {"id": "pep52u2w11", "en": "volunteer", "zh": "志愿者", "unit": 52, "group": "主题词", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u2w12", "en": "friendly", "zh": "友好的", "unit": 52, "group": "外貌品质", "level": 2, "sent": "A ____ community feels like home.", "emoji": "🤝"},
  {"id": "pep52u3w01", "en": "dream", "zh": "梦想", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💭"},
  {"id": "pep52u3w01", "en": "season", "zh": "季节", "unit": 52, "group": "主题词", "level": 2, "sent": "Autumn is a good ____ for hiking."},
  {"id": "pep52u3w02", "en": "future", "zh": "未来", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔮"},
  {"id": "pep52u3w02", "en": "spring", "zh": "春天", "unit": 52, "group": "主题词", "level": 2, "sent": "In ____, the trees turn green."},
  {"id": "pep52u3w03", "en": "scientist", "zh": "科学家", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🔬"},
  {"id": "pep52u3w03", "en": "summer", "zh": "夏天", "unit": 52, "group": "主题词", "level": 2, "sent": "____ is hot, but I like swimming."},
  {"id": "pep52u3w04", "en": "artist", "zh": "艺术家", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🎨"},
  {"id": "pep52u3w04", "en": "autumn", "zh": "秋天", "unit": 52, "group": "主题词", "level": 2, "sent": "____ is a good season for hiking."},
  {"id": "pep52u3w05", "en": "writer", "zh": "作家", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "✍️"},
  {"id": "pep52u3w05", "en": "winter", "zh": "冬天", "unit": 52, "group": "主题词", "level": 2, "sent": "____ mornings can be very cold."},
  {"id": "pep52u3w06", "en": "pilot", "zh": "飞行员", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "👨‍✈️"},
  {"id": "pep52u3w06", "en": "temperature", "zh": "气温", "unit": 52, "group": "主题词", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u3w07", "en": "astronaut", "zh": "宇航员", "unit": 52, "group": "人与家庭", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧑‍🚀"},
  {"id": "pep52u3w07", "en": "bloom", "zh": "开花", "unit": 52, "group": "植物自然", "level": 2, "sent": "Please say '____' again."},
  {"id": "pep52u3w08", "en": "harvest", "zh": "收获；收成", "unit": 52, "group": "主题词", "level": 2, "sent": "Farmers work hard during ____ time."},
  {"id": "pep52u4w01", "en": "invent", "zh": "发明", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💡"},
  {"id": "pep52u4w02", "en": "invention", "zh": "发明物", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💡"},
  {"id": "pep52u4w03", "en": "computer", "zh": "电脑", "unit": 52, "group": "校园场所", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💻"},
  {"id": "pep52u4w04", "en": "internet", "zh": "互联网", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🌐"},
  {"id": "pep52u4w05", "en": "online", "zh": "在线的", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💻"},
  {"id": "pep52u4w06", "en": "machine", "zh": "机器", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⚙️"},
  {"id": "pep52u4w07", "en": "smart", "zh": "智能的", "unit": 52, "group": "过去与将来", "level": 2, "sent": "Please remember the word '____'.", "emoji": "💡"},
  {"id": "pep52u5w01", "en": "rule", "zh": "规则", "unit": 52, "group": "规则安全", "level": 2, "sent": "Our class makes a new ____ every month.", "emoji": "📜"},
  {"id": "pep52u5w02", "en": "sign", "zh": "标志", "unit": 52, "group": "规则安全", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚸"},
  {"id": "pep52u5w03", "en": "wait", "zh": "等待", "unit": 52, "group": "规则安全", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚦"},
  {"id": "pep52u5w04", "en": "cross", "zh": "穿过", "unit": 52, "group": "天气服饰", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚶"},
  {"id": "pep52u5w05", "en": "safe", "zh": "安全的", "unit": 52, "group": "规则安全", "level": 2, "sent": "Keep the hallway ____ and clean.", "emoji": "🦺"},
  {"id": "pep52u5w06", "en": "dangerous", "zh": "危险的", "unit": 52, "group": "规则安全", "level": 2, "sent": "Please remember the word '____'.", "emoji": "⚠️"},
  {"id": "pep52u5w07", "en": "must", "zh": "必须", "unit": 52, "group": "规则安全", "level": 2, "sent": "Please remember the word '____'.", "emoji": "❗"},
  {"id": "pep52u5w08", "en": "public", "zh": "公共的", "unit": 52, "group": "规则安全", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🚉"},
  {"id": "pep52u6w01", "en": "plan", "zh": "计划", "unit": 52, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'."},
  {"id": "pep52u6w02", "en": "tomorrow", "zh": "明天", "unit": 52, "group": "时间", "level": 2, "sent": "Please remember the word '____'.", "emoji": "📅"},
  {"id": "pep52u6w03", "en": "next", "zh": "下一个", "unit": 52, "group": "颜色数字", "level": 2, "sent": "Please remember the word '____'.", "emoji": "➡️"},
  {"id": "pep52u6w04", "en": "visit", "zh": "拜访/参观", "unit": 52, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🧳"},
  {"id": "pep52u6w05", "en": "stay", "zh": "停留", "unit": 52, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏠"},
  {"id": "pep52u6w06", "en": "hotel", "zh": "旅馆", "unit": 52, "group": "地点方位", "level": 2, "sent": "Please remember the word '____'.", "emoji": "🏨"},
  {"id": "pep52u6w07", "en": "camera", "zh": "照相机", "unit": 52, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "📷"},
  {"id": "pep52u6w08", "en": "ready", "zh": "准备好的", "unit": 52, "group": "交通出行", "level": 2, "sent": "Please remember the word '____'.", "emoji": "✅"},
  {"id": "pep61u1w01", "en": "change", "zh": "变化", "unit": 61, "group": "比较成长", "level": 3, "sent": "Please say '____' again.", "emoji": "🔄"},
  {"id": "pep61u1w01", "en": "museum", "zh": "博物馆", "unit": 61, "group": "地点方位", "level": 3, "sent": "The ____ is famous for its space show.", "emoji": "🏛️"},
  {"id": "pep61u1w02", "en": "taller", "zh": "更高的", "unit": 61, "group": "外貌品质", "level": 3, "sent": "I am ____ than before.", "emoji": "📏"},
  {"id": "pep61u1w02", "en": "square", "zh": "广场", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w03", "en": "heavier", "zh": "更重的", "unit": 61, "group": "比较成长", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⚖️"},
  {"id": "pep61u1w03", "en": "bridge", "zh": "桥", "unit": 61, "group": "主题词", "level": 3, "sent": "The guide told us a fun story about the ____."},
  {"id": "pep61u1w04", "en": "smarter", "zh": "更聪明的", "unit": 61, "group": "外貌品质", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💡"},
  {"id": "pep61u1w04", "en": "ancient", "zh": "古老的", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w05", "en": "past", "zh": "过去", "unit": 61, "group": "时间", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⏳"},
  {"id": "pep61u1w05", "en": "modern", "zh": "现代的", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w06", "en": "now", "zh": "现在", "unit": 61, "group": "时间", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⏰"},
  {"id": "pep61u1w06", "en": "palace", "zh": "宫殿", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w07", "en": "learn", "zh": "学习", "unit": 61, "group": "日常动作", "level": 3, "sent": "Please remember the word '____'.", "emoji": "📚"},
  {"id": "pep61u1w07", "en": "tower", "zh": "塔", "unit": 61, "group": "主题词", "level": 3, "sent": "The ____ looks amazing at night."},
  {"id": "pep61u1w08", "en": "souvenir", "zh": "纪念品", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w09", "en": "guide", "zh": "导游；指南", "unit": 61, "group": "主题词", "level": 3, "sent": "The ____ told us a fun story about the bridge."},
  {"id": "pep61u1w10", "en": "landmark", "zh": "地标", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w11", "en": "crowded", "zh": "拥挤的", "unit": 61, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u1w12", "en": "postcard", "zh": "明信片", "unit": 61, "group": "主题词", "level": 3, "sent": "I want to buy a ____ for my English teacher."},
  {"id": "pep61u2w01", "en": "world", "zh": "世界", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🌍"},
  {"id": "pep61u2w01", "en": "invitation", "zh": "邀请；请柬", "unit": 61, "group": "校园场所", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u2w02", "en": "country", "zh": "国家", "unit": 61, "group": "地点方位", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏳️"},
  {"id": "pep61u2w02", "en": "celebrate", "zh": "庆祝", "unit": 61, "group": "校园场所", "level": 3, "sent": "Our class will ____ the end of the term together."},
  {"id": "pep61u2w03", "en": "China", "zh": "中国", "unit": 61, "group": "世界文化", "level": 3, "sent": "Hi, I’m Anna from ____."},
  {"id": "pep61u2w03", "en": "guest", "zh": "客人", "unit": 61, "group": "校园场所", "level": 3, "sent": "Each ____ can choose a game card."},
  {"id": "pep61u2w04", "en": "famous", "zh": "著名的", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⭐"},
  {"id": "pep61u2w04", "en": "host", "zh": "主人；主持人", "unit": 61, "group": "校园场所", "level": 3, "sent": "I would like to help the ____ welcome everyone."},
  {"id": "pep61u2w05", "en": "culture", "zh": "文化", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏛️"},
  {"id": "pep61u2w05", "en": "snack", "zh": "小吃", "unit": 61, "group": "校园场所", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u2w06", "en": "language", "zh": "语言", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💬"},
  {"id": "pep61u2w06", "en": "decorate", "zh": "装饰", "unit": 61, "group": "校园场所", "level": 3, "sent": "The hall looks beautiful after we ____ it."},
  {"id": "pep61u2w07", "en": "speak", "zh": "讲(语言)", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🗣️"},
  {"id": "pep61u2w07", "en": "schedule", "zh": "日程表", "unit": 61, "group": "校园场所", "level": 3, "sent": "We need a simple ____ for the party."},
  {"id": "pep61u2w08", "en": "performance", "zh": "表演", "unit": 61, "group": "校园场所", "level": 3, "sent": "The ____ will begin after the group photo."},
  {"id": "pep61u2w09", "en": "prepare", "zh": "准备", "unit": 61, "group": "校园场所", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u2w10", "en": "join", "zh": "参加；加入", "unit": 61, "group": "校园场所", "level": 3, "sent": "I can't ____ the game because I have to practice the piano."},
  {"id": "pep61u2w11", "en": "reply", "zh": "回复", "unit": 61, "group": "校园场所", "level": 3, "sent": "Please ____ before Wednesday afternoon."},
  {"id": "pep61u2w12", "en": "poster", "zh": "海报", "unit": 61, "group": "植物自然", "level": 3, "sent": "Let's make a ____ for the school event."},
  {"id": "pep61u3w01", "en": "great", "zh": "伟大的", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🌟"},
  {"id": "pep61u3w01", "en": "balanced", "zh": "均衡的", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "I sometimes help make a ____ breakfast."},
  {"id": "pep61u3w02", "en": "person", "zh": "人", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🧑"},
  {"id": "pep61u3w02", "en": "habit", "zh": "习惯", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "Please say '____' again.", "emoji": "✅"},
  {"id": "pep61u3w03", "en": "born", "zh": "出生", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "👶"},
  {"id": "pep61u3w03", "en": "exercise", "zh": "锻炼", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "Please say '____' again.", "emoji": "🏃"},
  {"id": "pep61u3w04", "en": "work", "zh": "工作", "unit": 61, "group": "日常动作", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💼"},
  {"id": "pep61u3w04", "en": "stretch", "zh": "拉伸", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "You should ____ before you run."},
  {"id": "pep61u3w05", "en": "hero", "zh": "英雄", "unit": 61, "group": "人与家庭", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🦸"},
  {"id": "pep61u3w06", "en": "story", "zh": "故事", "unit": 61, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'."},
  {"id": "pep61u3w06", "en": "screen", "zh": "屏幕", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "Too much ____ time is bad for our eyes."},
  {"id": "pep61u3w07", "en": "remember", "zh": "记住", "unit": 61, "group": "地点方位", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🧠"},
  {"id": "pep61u3w07", "en": "sleepy", "zh": "困倦的", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "He feels ____ because he went to bed late."},
  {"id": "pep61u3w08", "en": "respect", "zh": "尊重", "unit": 61, "group": "世界文化", "level": 3, "sent": "We show ____ to everyone in class.", "emoji": "🙏"},
  {"id": "pep61u3w08", "en": "active", "zh": "积极活跃的", "unit": 61, "group": "运动娱乐", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep61u4w01", "en": "lifestyle", "zh": "生活方式", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🧘"},
  {"id": "pep61u4w02", "en": "diet", "zh": "饮食", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🥗"},
  {"id": "pep61u4w03", "en": "check", "zh": "检查", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "✅"},
  {"id": "pep61u4w04", "en": "medicine", "zh": "药", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💊"},
  {"id": "pep61u4w05", "en": "advice", "zh": "建议", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💬"},
  {"id": "pep61u4w06", "en": "ill", "zh": "生病的", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🤒"},
  {"id": "pep61u4w07", "en": "better", "zh": "更好的", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💊"},
  {"id": "pep61u4w08", "en": "recover", "zh": "恢复", "unit": 61, "group": "健康习惯", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💊"},
  {"id": "pep61u5w01", "en": "space", "zh": "太空", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🚀"},
  {"id": "pep61u5w02", "en": "universe", "zh": "宇宙", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🌌"},
  {"id": "pep61u5w03", "en": "moon", "zh": "月球", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🌙"},
  {"id": "pep61u5w04", "en": "star", "zh": "星星", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⭐"},
  {"id": "pep61u5w05", "en": "planet", "zh": "行星", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🪐"},
  {"id": "pep61u5w06", "en": "spaceship", "zh": "宇宙飞船", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🚀"},
  {"id": "pep61u5w07", "en": "explore", "zh": "探索", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🧭"},
  {"id": "pep61u6w01", "en": "resource", "zh": "资源", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🌍"},
  {"id": "pep61u6w02", "en": "water", "zh": "水", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please say '____' again.", "emoji": "💧"},
  {"id": "pep61u6w03", "en": "oil", "zh": "石油", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🛢️"},
  {"id": "pep61u6w04", "en": "coal", "zh": "煤", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⚫"},
  {"id": "pep61u6w05", "en": "wood", "zh": "木材", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🪵"},
  {"id": "pep61u6w06", "en": "limit", "zh": "限制", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🚦"},
  {"id": "pep61u6w07", "en": "important", "zh": "重要的", "unit": 61, "group": "植物自然", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⚠️"},
  {"id": "pep62u1w01", "en": "middle school", "zh": "中学", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏫"},
  {"id": "pep62u1w01", "en": "change", "zh": "变化；改变", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w02", "en": "subject", "zh": "科目", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please say '____' again.", "emoji": "📚"},
  {"id": "pep62u1w02", "en": "grow", "zh": "成长；种植", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w03", "en": "history", "zh": "历史", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "📜"},
  {"id": "pep62u1w03", "en": "taller", "zh": "更高的", "unit": 62, "group": "外貌品质", "level": 3, "sent": "I am ____ than before."},
  {"id": "pep62u1w04", "en": "geography", "zh": "地理", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🗺️"},
  {"id": "pep62u1w04", "en": "shorter", "zh": "更矮的；更短的", "unit": 62, "group": "外貌品质", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w05", "en": "science", "zh": "科学", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🔬"},
  {"id": "pep62u1w05", "en": "stronger", "zh": "更强壮的", "unit": 62, "group": "比较", "level": 3, "sent": "My brother is ____ this year."},
  {"id": "pep62u1w06", "en": "term", "zh": "学期", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "📅"},
  {"id": "pep62u1w06", "en": "healthier", "zh": "更健康的", "unit": 62, "group": "健康习惯", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w07", "en": "prepare", "zh": "准备", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please say '____' again.", "emoji": "📝"},
  {"id": "pep62u1w07", "en": "careful", "zh": "认真的；仔细的", "unit": 62, "group": "主题词", "level": 3, "sent": "She is more ____ with her homework now."},
  {"id": "pep62u1w08", "en": "practice", "zh": "练习", "unit": 62, "group": "主题词", "level": 3, "sent": "I ____ English every evening."},
  {"id": "pep62u1w09", "en": "improve", "zh": "提高；改善", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w10", "en": "compare", "zh": "比较", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w11", "en": "mistake", "zh": "错误", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u1w12", "en": "progress", "zh": "进步", "unit": 62, "group": "主题词", "level": 3, "sent": "Small changes can bring big ____."},
  {"id": "pep62u2w01", "en": "memory", "zh": "回忆", "unit": 62, "group": "世界文化", "level": 3, "sent": "That ____ still makes me smile.", "emoji": "🧠"},
  {"id": "pep62u2w01", "en": "weekend", "zh": "周末", "unit": 62, "group": "时间", "level": 3, "sent": "Last ____, we visited a science museum.", "emoji": "🗓️"},
  {"id": "pep62u2w02", "en": "remember", "zh": "记起", "unit": 62, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🧠"},
  {"id": "pep62u2w03", "en": "primary school", "zh": "小学", "unit": 62, "group": "校园场所", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏫"},
  {"id": "pep62u2w03", "en": "event", "zh": "活动；事件", "unit": 62, "group": "主题词", "level": 3, "sent": "My parents came to our class ____."},
  {"id": "pep62u2w04", "en": "classmate", "zh": "同学", "unit": 62, "group": "人与家庭", "level": 3, "sent": "This is my new ____.", "emoji": "🧑‍🎓"},
  {"id": "pep62u2w04", "en": "festival", "zh": "节日", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u2w05", "en": "laugh", "zh": "笑", "unit": 62, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "😂"},
  {"id": "pep62u2w05", "en": "volunteer", "zh": "志愿者；自愿做", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u2w06", "en": "cry", "zh": "哭", "unit": 62, "group": "世界文化", "level": 3, "sent": "Please remember the word '____'.", "emoji": "😭"},
  {"id": "pep62u2w06", "en": "collect", "zh": "收集", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u2w07", "en": "thankful", "zh": "感激的", "unit": 62, "group": "情绪", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🙏"},
  {"id": "pep62u2w10", "en": "share", "zh": "分享", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u2w11", "en": "special", "zh": "特别的", "unit": 62, "group": "主题词", "level": 3, "sent": "It was a ____ day because everyone helped."},
  {"id": "pep62u3w01", "en": "farewell", "zh": "告别", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please remember the word '____'.", "emoji": "👋"},
  {"id": "pep62u3w01", "en": "trip", "zh": "旅行", "unit": 62, "group": "主题词", "level": 3, "sent": "My favourite part of the ____ was the boat ride."},
  {"id": "pep62u3w02", "en": "party", "zh": "派对", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🎉"},
  {"id": "pep62u3w03", "en": "invite", "zh": "邀请", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please say '____' again.", "emoji": "✉️"},
  {"id": "pep62u3w03", "en": "discover", "zh": "发现", "unit": 62, "group": "主题词", "level": 3, "sent": "Travel can help us ____ new places and ideas."},
  {"id": "pep62u3w04", "en": "invitation", "zh": "邀请函", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please say '____' again.", "emoji": "✉️"},
  {"id": "pep62u3w04", "en": "local", "zh": "当地的", "unit": 62, "group": "主题词", "level": 3, "sent": "We tried some ____ food near the lake."},
  {"id": "pep62u3w05", "en": "decorate", "zh": "装饰", "unit": 62, "group": "季节节日", "level": 3, "sent": "The hall looks beautiful after we ____ it.", "emoji": "🎀"},
  {"id": "pep62u3w05", "en": "guide", "zh": "向导；引导", "unit": 62, "group": "主题词", "level": 3, "sent": "The ____ told us an interesting story."},
  {"id": "pep62u3w06", "en": "perform", "zh": "表演", "unit": 62, "group": "人与家庭", "level": 3, "sent": "Please say '____' again.", "emoji": "🎭"},
  {"id": "pep62u3w06", "en": "map", "zh": "地图", "unit": 62, "group": "主题词", "level": 3, "sent": "First we read the ____, then we chose the route."},
  {"id": "pep62u3w07", "en": "speech", "zh": "演讲", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🎤"},
  {"id": "pep62u3w07", "en": "direction", "zh": "方向", "unit": 62, "group": "主题词", "level": 3, "sent": "Please say '____' again."},
  {"id": "pep62u3w08", "en": "goodbye", "zh": "再见", "unit": 62, "group": "季节节日", "level": 3, "sent": "Please remember the word '____'.", "emoji": "👋"},
  {"id": "pep62u3w08", "en": "crowded", "zh": "拥挤的", "unit": 62, "group": "主题词", "level": 3, "sent": "The street was ____, but the park was peaceful."},
  {"id": "pep62u4w01", "en": "hope", "zh": "希望", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🤞"},
  {"id": "pep62u4w02", "en": "wish", "zh": "愿望", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "⭐"},
  {"id": "pep62u4w03", "en": "try", "zh": "尝试", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "💪"},
  {"id": "pep62u4w04", "en": "best", "zh": "最好的", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'."},
  {"id": "pep62u4w05", "en": "success", "zh": "成功", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏆"},
  {"id": "pep62u4w06", "en": "successful", "zh": "成功的", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "🏆"},
  {"id": "pep62u4w07", "en": "proud", "zh": "骄傲的", "unit": 62, "group": "情绪", "level": 3, "sent": "I felt ____ when I finished my speech.", "emoji": "😌"},
  {"id": "pep62u4w08", "en": "bright", "zh": "明亮的", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "✨"},
  {"id": "pep62u4w09", "en": "journey", "zh": "旅程", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please say '____' again.", "emoji": "🧭"},
  {"id": "pep62u4w10", "en": "forward", "zh": "向前", "unit": 62, "group": "过去与将来", "level": 3, "sent": "Please remember the word '____'.", "emoji": "➡️"},
];
const PHRASES_PEP = [
  {"id": "pep_p01", "en": "make friends", "zh": "交朋友", "unit": 31},
  {"id": "pep_p02", "en": "how many", "zh": "多少", "unit": 31},
  {"id": "pep_p03", "en": "this is", "zh": "这是", "unit": 31},
  {"id": "pep_p04", "en": "look at", "zh": "看", "unit": 32},
  {"id": "pep_p05", "en": "get up", "zh": "起床", "unit": 41},
  {"id": "pep_p06", "en": "it's time for", "zh": "该做...了", "unit": 41},
  {"id": "pep_p07", "en": "what time", "zh": "什么时候", "unit": 41},
  {"id": "pep_p08", "en": "on the first floor", "zh": "在一楼", "unit": 41},
  {"id": "pep_p09", "en": "how much", "zh": "多少钱", "unit": 42},
  {"id": "pep_p10", "en": "go shopping", "zh": "去购物", "unit": 42},
  {"id": "pep_p11", "en": "feel happy", "zh": "感到高兴", "unit": 51},
  {"id": "pep_p12", "en": "how do you feel", "zh": "你感觉怎么样", "unit": 51},
  {"id": "pep_p13", "en": "how often", "zh": "多久一次", "unit": 52},
  {"id": "pep_p14", "en": "do exercise", "zh": "做运动", "unit": 52},
  {"id": "pep_p15", "en": "keep healthy", "zh": "保持健康", "unit": 52},
  {"id": "pep_p16", "en": "protect nature", "zh": "保护自然", "unit": 52},
  {"id": "pep_p17", "en": "on foot", "zh": "步行", "unit": 61},
  {"id": "pep_p18", "en": "by bus", "zh": "乘公共汽车", "unit": 61},
  {"id": "pep_p19", "en": "turn left", "zh": "向左转", "unit": 61},
  {"id": "pep_p20", "en": "next to", "zh": "紧邻", "unit": 61},
  {"id": "pep_p21", "en": "what did you do", "zh": "你做了什么", "unit": 62},
  {"id": "pep_p22", "en": "be going to", "zh": "打算", "unit": 62},
  {"id": "pep_p23", "en": "last weekend", "zh": "上个周末", "unit": 62},
  {"id": "pep_p24", "en": "taller than", "zh": "比...高", "unit": 62},
];
const SENTENCES_PEP = [
  {"id": "pep31u1s01", "en": "Hello! I am Tim.", "zh": "", "unit": 31, "level": 1, "gap": "Hello"},
  {"id": "pep31u1s02", "en": "Hi, my name is Anna.", "zh": "", "unit": 31, "level": 1, "gap": "name"},
  {"id": "pep31u1s03", "en": "Good morning, class.", "zh": "", "unit": 31, "level": 1, "gap": "Good"},
  {"id": "pep31u2s01", "en": "This is my mother.", "zh": "", "unit": 31, "level": 1, "gap": "mother"},
  {"id": "pep31u2s02", "en": "He is my father.", "zh": "", "unit": 31, "level": 1, "gap": "father"},
  {"id": "pep31u2s03", "en": "She is my sister.", "zh": "", "unit": 31, "level": 1, "gap": "sister"},
  {"id": "pep31u3s01", "en": "It is a panda.", "zh": "", "unit": 31, "level": 1, "gap": "panda"},
  {"id": "pep31u3s02", "en": "The panda is black and white.", "zh": "", "unit": 31, "level": 1, "gap": "panda"},
  {"id": "pep31u3s03", "en": "It is small and cute.", "zh": "", "unit": 31, "level": 1, "gap": "small"},
  {"id": "pep31u4s01", "en": "It is a flower.", "zh": "", "unit": 31, "level": 1, "gap": "flower"},
  {"id": "pep31u4s02", "en": "The tree is tall.", "zh": "", "unit": 31, "level": 1, "gap": "tree"},
  {"id": "pep31u4s03", "en": "The leaf is green.", "zh": "", "unit": 31, "level": 1, "gap": "leaf"},
  {"id": "pep32u1s01", "en": "Hello! My name is Leo.", "zh": "", "unit": 32, "level": 1, "gap": "Hello"},
  {"id": "pep32u1s02", "en": "Hi, I’m Anna from China.", "zh": "", "unit": 32, "level": 1, "gap": "Anna"},
  {"id": "pep32u1s03", "en": "This is my new classmate.", "zh": "", "unit": 32, "level": 1, "gap": "classmate"},
  {"id": "pep32u2s01", "en": "I like my little rabbit.", "zh": "", "unit": 32, "level": 1, "gap": "like"},
  {"id": "pep32u2s02", "en": "Do you have a pet at home?", "zh": "", "unit": 32, "level": 1, "gap": "have"},
  {"id": "pep32u2s03", "en": "My dog has big eyes.", "zh": "", "unit": 32, "level": 1, "gap": "eyes"},
  {"id": "pep32u3s01", "en": "Please read the short story.", "zh": "", "unit": 32, "level": 1, "gap": "Please"},
  {"id": "pep32u3s02", "en": "I can write my name well.", "zh": "", "unit": 32, "level": 1, "gap": "write"},
  {"id": "pep32u3s03", "en": "Can you help me with this word?", "zh": "", "unit": 32, "level": 1, "gap": "help"},
  {"id": "pep32u4s01", "en": "I like fruit and milk.", "zh": "", "unit": 32, "level": 1, "gap": "like"},
  {"id": "pep32u4s02", "en": "My breakfast is simple but healthy.", "zh": "", "unit": 32, "level": 1, "gap": "breakfast"},
  {"id": "pep32u4s03", "en": "Let’s eat some vegetables.", "zh": "", "unit": 32, "level": 1, "gap": "some"},
  {"id": "pep41u1s01", "en": "I can sweep the floor after dinner.", "zh": "", "unit": 41, "level": 2, "gap": "sweep"},
  {"id": "pep41u1s02", "en": "My sister often waters the plants on Saturday.", "zh": "", "unit": 41, "level": 2, "gap": "sister"},
  {"id": "pep41u1s03", "en": "We tidy the living room before guests come.", "zh": "", "unit": 41, "level": 2, "gap": "tidy"},
  {"id": "pep41u2s01", "en": "This is my friend Amy.", "zh": "", "unit": 41, "level": 2, "gap": "friend"},
  {"id": "pep41u2s02", "en": "She is friendly and kind.", "zh": "", "unit": 41, "level": 2, "gap": "friendly"},
  {"id": "pep41u2s03", "en": "Leo has curly hair and glasses.", "zh": "", "unit": 41, "level": 2, "gap": "curly"},
  {"id": "pep41u3s01", "en": "I live in an apartment near the park.", "zh": "", "unit": 41, "level": 2, "gap": "live"},
  {"id": "pep41u3s02", "en": "There is a supermarket beside my building.", "zh": "", "unit": 41, "level": 2, "gap": "There"},
  {"id": "pep41u3s03", "en": "Our street is quiet at night.", "zh": "", "unit": 41, "level": 2, "gap": "street"},
  {"id": "pep41u4s01", "en": "We can help by picking up litter.", "zh": "", "unit": 41, "level": 2, "gap": "help"},
  {"id": "pep41u4s02", "en": "Let's visit the community library this afternoon.", "zh": "", "unit": 41, "level": 2, "gap": "Let's"},
  {"id": "pep41u4s03", "en": "You should wait at the crosswalk.", "zh": "", "unit": 41, "level": 2, "gap": "should"},
  {"id": "pep42u1s01", "en": "We must keep our desks clean.", "zh": "", "unit": 42, "level": 2, "gap": "must"},
  {"id": "pep42u1s02", "en": "We mustn't talk when others are speaking.", "zh": "", "unit": 42, "level": 2, "gap": "mustn't"},
  {"id": "pep42u1s03", "en": "Can I borrow your blue pen?", "zh": "", "unit": 42, "level": 2, "gap": "borrow"},
  {"id": "pep42u2s01", "en": "I tidy my room every Saturday morning.", "zh": "", "unit": 42, "level": 2, "gap": "tidy"},
  {"id": "pep42u2s02", "en": "My brother sweeps the floor after dinner.", "zh": "", "unit": 42, "level": 2, "gap": "brother"},
  {"id": "pep42u2s03", "en": "We must wash our hands before meals.", "zh": "", "unit": 42, "level": 2, "gap": "must"},
  {"id": "pep42u3s01", "en": "It's half past seven now.", "zh": "", "unit": 42, "level": 2, "gap": "It's"},
  {"id": "pep42u3s02", "en": "I start school at eight o'clock.", "zh": "", "unit": 42, "level": 2, "gap": "start"},
  {"id": "pep42u3s03", "en": "We have a break at ten.", "zh": "", "unit": 42, "level": 2, "gap": "have"},
  {"id": "pep42u4s01", "en": "How much are these oranges?", "zh": "", "unit": 42, "level": 2, "gap": "much"},
  {"id": "pep42u4s02", "en": "I'd like two bottles of water, please.", "zh": "", "unit": 42, "level": 2, "gap": "like"},
  {"id": "pep42u4s03", "en": "This bag is cheap and useful.", "zh": "", "unit": 42, "level": 2, "gap": "cheap"},
  {"id": "pep51u1s01", "en": "This is my friend Leo. He is funny and kind.", "zh": "", "unit": 51, "level": 2, "gap": "friend"},
  {"id": "pep51u1s02", "en": "Mia is quiet in class, but she is active on the playground.", "zh": "", "unit": 51, "level": 2, "gap": "quiet"},
  {"id": "pep51u1s03", "en": "My two friends are different, but they work well together.", "zh": "", "unit": 51, "level": 2, "gap": "friends"},
  {"id": "pep51u2s01", "en": "How are you feeling today?", "zh": "", "unit": 51, "level": 2, "gap": "feeling"},
  {"id": "pep51u2s02", "en": "I am excited because our team won the game.", "zh": "", "unit": 51, "level": 2, "gap": "excited"},
  {"id": "pep51u2s03", "en": "She looks worried about her lost notebook.", "zh": "", "unit": 51, "level": 2, "gap": "looks"},
  {"id": "pep51u3s01", "en": "I do my homework first and then play outside.", "zh": "", "unit": 51, "level": 2, "gap": "homework"},
  {"id": "pep51u3s02", "en": "Our science project is fun but not easy.", "zh": "", "unit": 51, "level": 2, "gap": "science"},
  {"id": "pep51u3s03", "en": "She practices the violin for thirty minutes every day.", "zh": "", "unit": 51, "level": 2, "gap": "practices"},
  {"id": "pep51u4s01", "en": "A healthy day starts with a good breakfast.", "zh": "", "unit": 51, "level": 2, "gap": "healthy"},
  {"id": "pep51u4s02", "en": "I brush my teeth twice a day.", "zh": "", "unit": 51, "level": 2, "gap": "brush"},
  {"id": "pep51u4s03", "en": "We should wash our hands before meals.", "zh": "", "unit": 51, "level": 2, "gap": "should"},
  {"id": "pep52u1s01", "en": "We should listen to others carefully.", "zh": "", "unit": 52, "level": 2, "gap": "should"},
  {"id": "pep52u1s02", "en": "You shouldn't eat in the library.", "zh": "", "unit": 52, "level": 2, "gap": "shouldn't"},
  {"id": "pep52u1s03", "en": "Please wait for your turn.", "zh": "", "unit": 52, "level": 2, "gap": "Please"},
  {"id": "pep52u2s01", "en": "There is a small garden behind our building.", "zh": "", "unit": 52, "level": 2, "gap": "There"},
  {"id": "pep52u2s02", "en": "My neighbours often say hello to each other.", "zh": "", "unit": 52, "level": 2, "gap": "neighbours"},
  {"id": "pep52u2s03", "en": "We can help keep the street clean.", "zh": "", "unit": 52, "level": 2, "gap": "help"},
  {"id": "pep52u3s01", "en": "In spring, the trees turn green.", "zh": "", "unit": 52, "level": 2, "gap": "spring"},
  {"id": "pep52u3s02", "en": "Summer is hot, but I like swimming.", "zh": "", "unit": 52, "level": 2, "gap": "Summer"},
  {"id": "pep52u3s03", "en": "Autumn is a good season for hiking.", "zh": "", "unit": 52, "level": 2, "gap": "Autumn"},
  {"id": "pep52u4s01", "en": "My hometown has a river and two old bridges.", "zh": "", "unit": 52, "level": 2, "gap": "hometown"},
  {"id": "pep52u4s02", "en": "The market is busy in the morning.", "zh": "", "unit": 52, "level": 2, "gap": "market"},
  {"id": "pep52u4s03", "en": "Many visitors come for the mountain view.", "zh": "", "unit": 52, "level": 2, "gap": "Many"},
  {"id": "pep61u1s01", "en": "This city is old, but its streets are very clean.", "zh": "", "unit": 61, "level": 3, "gap": "city"},
  {"id": "pep61u1s02", "en": "My parents want to visit a quiet town by the sea.", "zh": "", "unit": 61, "level": 3, "gap": "parents"},
  {"id": "pep61u1s03", "en": "The museum is famous for its space show.", "zh": "", "unit": 61, "level": 3, "gap": "museum"},
  {"id": "pep61u2s01", "en": "Would you like to come to our English party this Friday?", "zh": "", "unit": 61, "level": 3, "gap": "Would"},
  {"id": "pep61u2s02", "en": "I can't join the game because I have to practice the piano.", "zh": "", "unit": 61, "level": 3, "gap": "can't"},
  {"id": "pep61u2s03", "en": "Let's make a poster for the school event.", "zh": "", "unit": 61, "level": 3, "gap": "Let's"},
  {"id": "pep61u3s01", "en": "I usually drink water before class in the morning.", "zh": "", "unit": 61, "level": 3, "gap": "usually"},
  {"id": "pep61u3s02", "en": "My sister never skips breakfast.", "zh": "", "unit": 61, "level": 3, "gap": "sister"},
  {"id": "pep61u3s03", "en": "You should stretch before you run.", "zh": "", "unit": 61, "level": 3, "gap": "should"},
  {"id": "pep61u4s01", "en": "I want a new toy, but I need a notebook first.", "zh": "", "unit": 61, "level": 3, "gap": "want"},
  {"id": "pep61u4s03", "en": "This school bag costs less, but it looks stronger.", "zh": "", "unit": 61, "level": 3, "gap": "school"},
  {"id": "pep61u4s04", "en": "I save ten yuan every week for a birthday gift.", "zh": "", "unit": 61, "level": 3, "gap": "save"},
  {"id": "pep62u1s01", "en": "I am taller than before.", "zh": "", "unit": 62, "level": 3, "gap": "taller"},
  {"id": "pep62u1s02", "en": "My brother is stronger this year.", "zh": "", "unit": 62, "level": 3, "gap": "brother"},
  {"id": "pep62u1s03", "en": "This maths problem is easier now.", "zh": "", "unit": 62, "level": 3, "gap": "maths"},
  {"id": "pep62u2s01", "en": "Last weekend, we visited a science museum.", "zh": "", "unit": 62, "level": 3, "gap": "Last"},
  {"id": "pep62u2s02", "en": "I felt proud when I finished my speech.", "zh": "", "unit": 62, "level": 3, "gap": "felt"},
  {"id": "pep62u2s03", "en": "Our class prepared a short play for the open day.", "zh": "", "unit": 62, "level": 3, "gap": "class"},
  {"id": "pep62u3s01", "en": "We went to the old town and took many photos there.", "zh": "", "unit": 62, "level": 3, "gap": "went"},
  {"id": "pep62u3s02", "en": "The street was crowded, but the park was peaceful.", "zh": "", "unit": 62, "level": 3, "gap": "street"},
  {"id": "pep62u3s03", "en": "I learned how to ask for directions politely.", "zh": "", "unit": 62, "level": 3, "gap": "learned"},
  {"id": "pep62u4s01", "en": "I am going to make a study schedule for the summer holiday.", "zh": "", "unit": 62, "level": 3, "gap": "going"},
  {"id": "pep62u4s02", "en": "My goal is to read more English books.", "zh": "", "unit": 62, "level": 3, "gap": "goal"},
  {"id": "pep62u4s03", "en": "I want to manage my time better in middle school.", "zh": "", "unit": 62, "level": 3, "gap": "want"},
];
const QA_PEP = [
  {"id": "pep31u1q11", "unit": 31, "q": "What is the boy's name?", "answer": "Mike", "wrong": ["Lily", "Tom", "I don't know."]},
  {"id": "pep31u1q12", "unit": 31, "q": "What does Lily say?", "answer": "My name is Lily.", "wrong": ["Good night.", "Thank you.", "I don't know."]},
  {"id": "pep31u2q11", "unit": 31, "q": "Who is tall?", "answer": "father", "wrong": ["mother", "brother", "I don't know."]},
  {"id": "pep31u2q12", "unit": 31, "q": "Who likes football?", "answer": "brother", "wrong": ["father", "mother", "I don't know."]},
];
const CLOZE_PEP = [
  {"id": "pep31u1c1", "unit": 31, "level": 1, "text": "____! I am Ben.", "options": ["Hello", "hi", "good", "morning"], "answer": "Hello", "zh": "introducing_self"},
  {"id": "pep31u1c2", "unit": 31, "level": 1, "text": "My ____ is Amy.", "options": ["name", "hello", "hi", "good"], "answer": "name", "zh": "telling_name"},
  {"id": "pep31u2c1", "unit": 31, "level": 1, "text": "____ is my mother.", "options": ["This", "family", "father", "mother"], "answer": "This", "zh": "introducing_family"},
  {"id": "pep31u2c2", "unit": 31, "level": 1, "text": "____ is she?", "options": ["Who", "family", "father", "mother"], "answer": "Who", "zh": "asking_about_people"},
  {"id": "pep31u3c1", "unit": 31, "level": 1, "text": "It is a ____.", "options": ["panda", "animal", "monkey", "bird"], "answer": "panda", "zh": "naming_animals"},
  {"id": "pep31u3c2", "unit": 31, "level": 1, "text": "It is ____.", "options": ["small", "animal", "panda", "monkey"], "answer": "small", "zh": "describing_animals"},
  {"id": "pep32u1c1", "unit": 32, "level": 1, "text": "____’s your name?", "options": ["What", "hello", "hi", "name"], "answer": "What", "zh": "Asking for a name"},
  {"id": "pep32u1c2", "unit": 32, "level": 1, "text": "____ are you from?", "options": ["Where", "hello", "hi", "name"], "answer": "Where", "zh": "Asking where someone is from"},
  {"id": "pep32u2c1", "unit": 32, "level": 1, "text": "Do you ____ a pet?", "options": ["have", "pet", "rabbit", "dog"], "answer": "have", "zh": "Asking about possession"},
  {"id": "pep32u2c2", "unit": 32, "level": 1, "text": "I ____ rabbits.", "options": ["like", "pet", "rabbit", "dog"], "answer": "like", "zh": "Expressing likes"},
  {"id": "pep32u3c1", "unit": 32, "level": 1, "text": "____ you help me?", "options": ["Can", "read", "write", "listen"], "answer": "Can", "zh": "Asking for help"},
  {"id": "pep32u3c2", "unit": 32, "level": 1, "text": "____’s read together.", "options": ["Let", "read", "write", "listen"], "answer": "Let", "zh": "Making a suggestion"},
  {"id": "pep41u1c1", "unit": 41, "level": 2, "text": "____ you help me set the table?", "options": ["Can", "sweep", "mop", "tidy"], "answer": "Can", "zh": ""},
  {"id": "pep41u1c2", "unit": 41, "level": 2, "text": "I ____ sweep the floor at home.", "options": ["can", "sweep", "mop", "tidy"], "answer": "can", "zh": ""},
  {"id": "pep41u2c1", "unit": 41, "level": 2, "text": "____ is my friend, May.", "options": ["This", "friend", "classmate", "friendly"], "answer": "This", "zh": ""},
  {"id": "pep41u2c2", "unit": 41, "level": 2, "text": "She is ____.", "options": ["friendly", "friend", "classmate", "kind"], "answer": "friendly", "zh": ""},
  {"id": "pep41u3c1", "unit": 41, "level": 2, "text": "I ____ in an apartment.", "options": ["live", "apartment", "building", "street"], "answer": "live", "zh": ""},
  {"id": "pep41u3c2", "unit": 41, "level": 2, "text": "____ is a park near my home.", "options": ["There", "apartment", "building", "street"], "answer": "There", "zh": ""},
  {"id": "pep42u1c1", "unit": 42, "level": 2, "text": "We ____ listen carefully.", "options": ["must", "rule", "quiet", "careful"], "answer": "must", "zh": "stating_rules"},
  {"id": "pep42u1c2", "unit": 42, "level": 2, "text": "We ____ run in the classroom.", "options": ["mustn't", "rule", "quiet", "careful"], "answer": "mustn't", "zh": "stating_prohibitions"},
  {"id": "pep42u2c1", "unit": 42, "level": 2, "text": "At ____, I must tidy my room.", "options": ["home", "tidy", "dish", "sweep"], "answer": "home", "zh": "stating_home_rules"},
  {"id": "pep42u2c2", "unit": 42, "level": 2, "text": "I ____ watch TV before dinner.", "options": ["mustn't", "tidy", "dish", "sweep"], "answer": "mustn't", "zh": "negative_rule"},
  {"id": "pep42u3c1", "unit": 42, "level": 2, "text": "____ time is it now?", "options": ["What", "timetable", "quarter", "half"], "answer": "What", "zh": "asking_time"},
  {"id": "pep42u3c2", "unit": 42, "level": 2, "text": "____ seven thirty.", "options": ["It's", "timetable", "quarter", "half"], "answer": "It's", "zh": "telling_time"},
  {"id": "pep52u1c1", "unit": 52, "level": 2, "text": "We ____ walk on the right.", "options": ["should", "rule", "follow", "quiet"], "answer": "should", "zh": "giving_advice"},
  {"id": "pep52u1c2", "unit": 52, "level": 2, "text": "We ____ run in the hallway.", "options": ["shouldn't", "rule", "follow", "quiet"], "answer": "shouldn't", "zh": "saying_what_not_to_do"},
  {"id": "pep52u2c1", "unit": 52, "level": 2, "text": "____ is a park near my home.", "options": ["There", "community", "neighbour", "square"], "answer": "There", "zh": "describing_place"},
  {"id": "pep52u2c2", "unit": 52, "level": 2, "text": "____ in my community are friendly.", "options": ["People", "community", "neighbour", "square"], "answer": "People", "zh": "describing_people"},
  {"id": "pep52u3c1", "unit": 52, "level": 2, "text": "I ____ spring because the flowers bloom.", "options": ["like", "season", "spring", "summer"], "answer": "like", "zh": "expressing_preference"},
  {"id": "pep52u3c2", "unit": 52, "level": 2, "text": "In ____, we go swimming.", "options": ["July", "season", "spring", "summer"], "answer": "July", "zh": "talking_about_time"},
  {"id": "pep61u1c1", "unit": 61, "level": 3, "text": "I ____ to visit Paris because it is beautiful.", "options": ["want", "museum", "square", "bridge"], "answer": "want", "zh": "expressing_travel_wishes"},
  {"id": "pep61u1c2", "unit": 61, "level": 3, "text": "____ is famous for West Lake.", "options": ["Hangzhou", "museum", "square", "bridge"], "answer": "Hangzhou", "zh": "describing_places"},
  {"id": "pep61u2c1", "unit": 61, "level": 3, "text": "____ you like to join us for the school fair?", "options": ["Would", "invitation", "celebrate", "guest"], "answer": "Would", "zh": "inviting"},
  {"id": "pep61u2c2", "unit": 61, "level": 3, "text": "____, I'd love to.", "options": ["Sure", "invitation", "celebrate", "guest"], "answer": "Sure", "zh": "accepting_invitation"},
  {"id": "pep61u3c1", "unit": 61, "level": 3, "text": "I ____ drink water after PE class.", "options": ["usually", "balanced", "habit", "exercise"], "answer": "usually", "zh": "talking_about_habits"},
  {"id": "pep61u3c2", "unit": 61, "level": 3, "text": "You ____ eat more vegetables.", "options": ["should", "balanced", "habit", "exercise"], "answer": "should", "zh": "giving_advice"},
  {"id": "pep62u1c1", "unit": 62, "level": 3, "text": "I am ____ than before.", "options": ["taller", "change", "grow", "shorter"], "answer": "taller", "zh": "describing_change"},
  {"id": "pep62u1c2", "unit": 62, "level": 3, "text": "My ____ has changed a lot.", "options": ["school", "change", "grow", "taller"], "answer": "school", "zh": "describing_change"},
  {"id": "pep62u2c1", "unit": 62, "level": 3, "text": "____ weekend, we cleaned the park.", "options": ["Last", "weekend", "memory", "event"], "answer": "Last", "zh": "talking_about_past_events"},
  {"id": "pep62u2c2", "unit": 62, "level": 3, "text": "It ____ a special day because my parents came.", "options": ["was", "weekend", "memory", "event"], "answer": "was", "zh": "giving_reasons"},
  {"id": "pep62u3c1", "unit": 62, "level": 3, "text": "We ____ to Hangzhou and rode bikes there.", "options": ["went", "trip", "journey", "discover"], "answer": "went", "zh": "describing_trips"},
  {"id": "pep62u3c2", "unit": 62, "level": 3, "text": "The ____ was crowded, so we stayed close together.", "options": ["market", "trip", "journey", "discover"], "answer": "market", "zh": "describing_places_and_results"},
];
const DIALOGUES_PEP = [
  {"id": "pep51u1d1", "unit": 51, "level": 2, "lines": [{"who": "A", "text": "What does Leo love?"}, {"who": "B", "text": "____"}], "options": ["He loves basketball.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "He loves basketball.", "explain": "朋友的外貌、性格与差异"},
  {"id": "pep51u2d1", "unit": 51, "level": 2, "lines": [{"who": "A", "text": "Why does Mina feel nervous at first?"}, {"who": "B", "text": "____"}], "options": ["Because she cannot find her school badge.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "Because she cannot find her school badge.", "explain": "情绪表达与情绪调节"},
  {"id": "pep51u3d1", "unit": 51, "level": 2, "lines": [{"who": "A", "text": "What does Mina do after school first?"}, {"who": "B", "text": "____"}], "options": ["She takes a short break and eats fruit.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "She takes a short break and eats fruit.", "explain": "学习、任务与兴趣活动"},
  {"id": "pep51u4d1", "unit": 51, "level": 2, "lines": [{"who": "A", "text": "What time does Rita wake up?"}, {"who": "B", "text": "____"}], "options": ["At six thirty.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "At six thirty.", "explain": "健康习惯与日常作息"},
  {"id": "pep52u1d1", "unit": 52, "level": 2, "lines": [{"who": "A", "text": "Why do Tina and her brother stand in line?"}, {"who": "B", "text": "____"}], "options": ["Because they follow school rules.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "Because they follow school rules.", "explain": "规则、礼貌与校园安全"},
  {"id": "pep52u2d1", "unit": 52, "level": 2, "lines": [{"who": "A", "text": "What do Maya and her father do first?"}, {"who": "B", "text": "____"}], "options": ["They pick up litter in the park and water flowers.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "They pick up litter in the park and water flowers.", "explain": "社区环境、设施与互助"},
  {"id": "pep52u3d1", "unit": 52, "level": 2, "lines": [{"who": "A", "text": "What blooms in spring?"}, {"who": "B", "text": "____"}], "options": ["Pink flowers.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "Pink flowers.", "explain": "季节、月份与季节活动"},
  {"id": "pep52u4d1", "unit": 52, "level": 2, "lines": [{"who": "A", "text": "Where is Ella's hometown?"}, {"who": "B", "text": "____"}], "options": ["By a river.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "By a river.", "explain": "家乡介绍、自然与人文特色"},
  {"id": "pep61u1d1", "unit": 61, "level": 3, "lines": [{"who": "A", "text": "Where did Lily go after crossing the bridge?"}, {"who": "B", "text": "____"}], "options": ["She went to a history museum.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "She went to a history museum.", "explain": "世界景点、城市文化与旅行体验"},
  {"id": "pep61u2d1", "unit": 61, "level": 3, "lines": [{"who": "A", "text": "Where will the school fair be?"}, {"who": "B", "text": "____"}], "options": ["In the playground.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "In the playground.", "explain": "聚会、学校活动与人际交往"},
  {"id": "pep61u3d1", "unit": 61, "level": 3, "lines": [{"who": "A", "text": "Why did Tom feel sleepy before?"}, {"who": "B", "text": "____"}], "options": ["Because he went to bed late.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "Because he went to bed late.", "explain": "健康饮食、运动和作息习惯"},
  {"id": "pep61u4d1", "unit": 61, "level": 3, "lines": [{"who": "A", "text": "How much money does Mina save for the class trip?"}, {"who": "B", "text": "____"}], "options": ["Eight yuan.", "I don't know.", "Yes, it is red.", "It is on Sunday."], "answer": "Eight yuan.", "explain": "零花钱、消费选择与简单理财"},
];
const READINGS_PEP = [
  {"id": "pep51u1r1", "unit": 51, "level": 2, "title": "Two Different Friends", "text": "I have two good friends, Leo and Evan. Leo is tall and active. He loves basketball and runs very fast. Evan is quiet and clever. He likes reading and drawing maps. They are very different, but they help each other every day. Leo helps Evan in PE class, and Evan helps Leo with science homework. After school, the three of us often go to the library or play in the park. Different friends can still be a great team.", "questions": [{"q": "What does Leo love?", "options": ["He loves basketball.", "have two good", "friends", "Evan"], "answer": "He loves basketball.", "explain": "文中提到相关内容。"}, {"q": "What does Evan like doing?", "options": ["He likes reading and drawing maps.", "have two good", "friends", "Evan"], "answer": "He likes reading and drawing maps.", "explain": "文中提到相关内容。"}]},
  {"id": "pep51u2r1", "unit": 51, "level": 2, "title": "A Busy Morning", "text": "This morning, Mina wakes up late. At first, she feels nervous because she cannot find her school badge. Her mother tells her to stay calm and breathe slowly. Then Mina remembers that the badge is in her art bag. On the bus, she still feels worried about her class speech. Her friend Hana smiles at her and says, 'You can do it!' After Mina gives the speech, her teacher says it is clear and interesting. Mina feels proud and happy at the end of the day.", "questions": [{"q": "Why does Mina feel nervous at first?", "options": ["Because she cannot find her school badge.", "This morning", "Mina wakes up", "late"], "answer": "Because she cannot find her school badge.", "explain": "文中提到相关内容。"}, {"q": "What does her mother tell her to do?", "options": ["Stay calm and breathe slowly.", "This morning", "Mina wakes up", "late"], "answer": "Stay calm and breathe slowly.", "explain": "文中提到相关内容。"}]},
  {"id": "pep52u1r1", "unit": 52, "level": 2, "title": "A Safer School Day", "text": "Every morning, Tina walks to school with her brother. At school, they follow many rules. They stand in line at the gate. They walk slowly on the stairs. In the library, they read quietly. On the playground, they wait for their turn. Tina says rules are not boring. Rules help everyone stay safe and happy.", "questions": [{"q": "Why do Tina and her brother stand in line?", "options": ["Because they follow school rules.", "Every morning", "Tina walks to", "school with her"], "answer": "Because they follow school rules.", "explain": "文中提到相关内容。"}, {"q": "Where do they read quietly?", "options": ["In the library.", "Every morning", "Tina walks to", "school with her"], "answer": "In the library.", "explain": "文中提到相关内容。"}]},
  {"id": "pep52u2r1", "unit": 52, "level": 2, "title": "A Helpful Saturday", "text": "On Saturday morning, Maya and her father join a community clean-up. They pick up litter in the park and water flowers in the garden. Later, they help an old neighbour carry some bags. Maya is tired, but she feels happy. She says a good community is clean, safe and full of helpful people.", "questions": [{"q": "What do Maya and her father do first?", "options": ["They pick up litter in the park and water flowers.", "Saturday morning", "Maya and her", "father join"], "answer": "They pick up litter in the park and water flowers.", "explain": "文中提到相关内容。"}, {"q": "Who do they help later?", "options": ["An old neighbour.", "Saturday morning", "Maya and her", "father join"], "answer": "An old neighbour.", "explain": "文中提到相关内容。"}]},
  {"id": "pep61u1r1", "unit": 61, "level": 3, "title": "A City by the River", "text": "Lily visited a city by a river with her family in summer. In the morning, they walked across an old bridge and took photos of a tall tower. Then they went to a history museum. Lily liked the model boats there very much. After lunch, they sat in a big square and watched street music. The city was crowded, but it was clean and lively. Before going home, Lily bought a blue postcard for her best friend.", "questions": [{"q": "Where did Lily go after crossing the bridge?", "options": ["She went to a history museum.", "Lily visited", "city by", "river with her"], "answer": "She went to a history museum.", "explain": "文中提到相关内容。"}, {"q": "Why did Lily buy a postcard?", "options": ["To give it to her best friend.", "Lily visited", "city by", "river with her"], "answer": "To give it to her best friend.", "explain": "文中提到相关内容。"}]},
  {"id": "pep61u2r1", "unit": 61, "level": 3, "title": "A School Fair Invitation", "text": "Dear classmates, our school fair is on Saturday afternoon in the playground. There will be food stands, game booths and student performances. We need helpers to decorate the stage at one o'clock. The fair opens at two and ends at five. Please wear your school T-shirt. If you want to join the singing show, please tell Ms Li before Thursday. We hope every student can come and enjoy the day.", "questions": [{"q": "Where will the school fair be?", "options": ["In the playground.", "There will be", "food stands", "game booths and"], "answer": "In the playground.", "explain": "文中提到相关内容。"}, {"q": "What should students wear?", "options": ["Their school T-shirt.", "Dear classmates", "school fair is", "Saturday afternoon in"], "answer": "Their school T-shirt.", "explain": "文中提到相关内容。"}]},
];

/* ===== 教材三：2024 广州教科版 ===== */
const UNITS_GZ = [
  { id: 3, label: "三年级", en: "Letters, Colours & Actions", zh: "字母·色彩·动作" },
  { id: 4, label: "四年级", en: "Habits, Subjects & Places", zh: "习惯·学科·场所" },
  { id: 5, label: "五年级", en: "Traits & Environment", zh: "品质·情感·环境" },
  { id: 6, label: "六年级", en: "History & Future", zh: "历史·科技·未来" },
];
const WORDS_GZ = [
  { id: "g301", en: "letter", zh: "字母", emoji: "🔤", unit: 3, group: "信息素养", level: 1, sent: "What is this ____?" },
  { id: "g302", en: "password", zh: "密码", emoji: "🔑", unit: 3, group: "信息素养", level: 2, sent: "Do not tell others your ____." },
  { id: "g303", en: "colour", zh: "颜色", emoji: "🎨", unit: 3, group: "颜色动作", level: 1, sent: "What ____ is the key?" },
  { id: "g304", en: "draw", zh: "画", emoji: "✏️", unit: 3, group: "颜色动作", level: 1, sent: "I can ____ a big ship." },
  { id: "g305", en: "listen", zh: "听", emoji: "👂", unit: 3, group: "颜色动作", level: 1, sent: "Please ____ to the teacher." },
  { id: "g306", en: "jump", zh: "跳", emoji: "🤸", unit: 3, group: "颜色动作", level: 1, sent: "Can you ____ high?" },
  { id: "g401", en: "Maths", zh: "数学", emoji: "➗", unit: 4, group: "学科", level: 1, sent: "I like ____ best." },
  { id: "g402", en: "Science", zh: "科学", emoji: "🔬", unit: 4, group: "学科", level: 2, sent: "We have ____ on Tuesday." },
  { id: "g403", en: "bank", zh: "银行", emoji: "🏦", unit: 4, group: "场所方位", level: 2, sent: "The ____ is near the park." },
  { id: "g404", en: "station", zh: "车站", emoji: "🚉", unit: 4, group: "场所方位", level: 2, sent: "Walk to the ____, please." },
  { id: "g405", en: "expensive", zh: "昂贵的", emoji: "💸", unit: 4, group: "购物", level: 3, sent: "This coat is too ____." },
  { id: "g406", en: "early", zh: "早的", emoji: "🌅", unit: 4, group: "日常习惯", level: 1, sent: "I get up ____ every day." },
  { id: "g501", en: "strict", zh: "严格的", emoji: "📏", unit: 5, group: "品质", level: 3, sent: "Our teacher is kind but ____." },
  { id: "g502", en: "proud", zh: "自豪的", emoji: "😌", unit: 5, group: "情绪", level: 3, sent: "I am ____ of my class." },
  { id: "g503", en: "shy", zh: "害羞的", emoji: "😳", unit: 5, group: "品质", level: 2, sent: "He is ____ in front of people." },
  { id: "g504", en: "lake", zh: "湖", emoji: "🏞️", unit: 5, group: "自然环境", level: 1, sent: "There is a ____ in the park." },
  { id: "g505", en: "environment", zh: "环境", emoji: "🌏", unit: 5, group: "自然环境", level: 3, sent: "We must protect the ____." },
  { id: "g506", en: "exercise", zh: "运动", emoji: "🏃", unit: 5, group: "健康习惯", level: 2, sent: "How often do you ____?" },
  { id: "g601", en: "invented", zh: "发明（过去式）", emoji: "💡", unit: 6, group: "过去与科技", level: 3, sent: "He ____ a new machine." },
  { id: "g602", en: "scientist", zh: "科学家", emoji: "🔬", unit: 6, group: "梦想职业", level: 2, sent: "She wants to be a ____." },
  { id: "g603", en: "faster", zh: "更快的", emoji: "🏃", unit: 6, group: "比较级", level: 2, sent: "A plane is ____ than a train." },
  { id: "g604", en: "finally", zh: "最后", emoji: "🏁", unit: 6, group: "逻辑连接", level: 3, sent: "____, we went home." },
  { id: "g605", en: "engineer", zh: "工程师", emoji: "🧑‍🔧", unit: 6, group: "梦想职业", level: 3, sent: "My father is an ____." },
  { id: "g606", en: "travelled", zh: "旅行（过去式）", emoji: "🧳", unit: 6, group: "过去与科技", level: 3, sent: "They ____ to Guangzhou." },
];
const PHRASES_GZ = [
  { id: "gp01", en: "be a good listener", zh: "做一个好的倾听者", unit: 3 },
  { id: "gp02", en: "it's time to", zh: "该做……了", unit: 3 },
  { id: "gp03", en: "wash face", zh: "洗脸", unit: 4 },
  { id: "gp04", en: "in front of", zh: "在……前面", unit: 4 },
  { id: "gp05", en: "keep fit", zh: "保持健康", unit: 5 },
  { id: "gp06", en: "protect the environment", zh: "保护环境", unit: 5 },
  { id: "gp07", en: "after that", zh: "在那之后", unit: 6 },
  { id: "gp08", en: "in the future", zh: "在将来", unit: 6 },
];
const SENTENCES_GZ = [
  { id: "gs01", en: "What colour is the key?", zh: "这个按键是什么颜色？", unit: 3, level: 1, gap: "colour" },
  { id: "gs02", en: "It is time to exercise.", zh: "该运动了。", unit: 3, level: 1, gap: "exercise" },
  { id: "gs03", en: "Can you draw a red apple?", zh: "你会画一个红苹果吗？", unit: 3, level: 1, gap: "draw" },
  { id: "gs04", en: "Please listen to your friend.", zh: "请听你的朋友说。", unit: 3, level: 2, gap: "listen" },
  { id: "gs05", en: "What time do you get up?", zh: "你几点起床？", unit: 4, level: 1, gap: "time" },
  { id: "gs06", en: "I like Science best.", zh: "我最喜欢科学。", unit: 4, level: 1, gap: "Science" },
  { id: "gs07", en: "The shop is in front of the bank.", zh: "商店在银行前面。", unit: 4, level: 2, gap: "bank" },
  { id: "gs08", en: "I am cleaning my room now.", zh: "我正在打扫我的房间。", unit: 4, level: 2, gap: "cleaning" },
  { id: "gs09", en: "She is kind and hard-working.", zh: "她友善又勤奋。", unit: 5, level: 2, gap: "kind" },
  { id: "gs10", en: "Why are you proud today?", zh: "你今天为什么感到自豪？", unit: 5, level: 3, gap: "proud" },
  { id: "gs11", en: "We shouldn't eat too much junk food.", zh: "我们不应该吃太多垃圾食品。", unit: 5, level: 3, gap: "junk" },
  { id: "gs12", en: "There is a lake near the mountain.", zh: "山附近有一个湖。", unit: 5, level: 2, gap: "lake" },
  { id: "gs13", en: "Where did you go last week?", zh: "你上周去了哪里？", unit: 6, level: 2, gap: "week" },
  { id: "gs14", en: "He invented a useful machine.", zh: "他发明了一台有用的机器。", unit: 6, level: 3, gap: "invented" },
  { id: "gs15", en: "A plane is faster than a train.", zh: "飞机比火车快。", unit: 6, level: 2, gap: "faster" },
  { id: "gs16", en: "First we plan, then we start.", zh: "我们先计划，然后开始。", unit: 6, level: 3, gap: "plan" },
];
const QA_GZ = [
  { id: "gq01", unit: 3, q: "Who is this?", answer: "This is my teacher.", wrong: ["It is blue.", "Yes, I can jump.", "At eight o'clock."] },
  { id: "gq02", unit: 3, q: "Can you draw a dog?", answer: "Yes, I can.", wrong: ["It is a letter.", "I am seven.", "In the classroom."] },
  { id: "gq03", unit: 4, q: "What subject do you like best?", answer: "I like Art best.", wrong: ["It is twenty yuan.", "He is a driver.", "Next to the station."] },
  { id: "gq04", unit: 4, q: "How much is this book?", answer: "It is fifteen yuan.", wrong: ["It is Monday.", "She is shy.", "By bike."] },
  { id: "gq05", unit: 5, q: "What is your teacher like?", answer: "She is strict but kind.", wrong: ["She is in the lake.", "Yes, she does.", "Last Sunday."] },
  { id: "gq06", unit: 5, q: "Why do you feel nervous?", answer: "Because I have a speech today.", wrong: ["It is a river.", "Three times a week.", "No, thank you."] },
  { id: "gq07", unit: 6, q: "What did you do yesterday?", answer: "I visited a museum.", wrong: ["I am going to run.", "It is faster.", "Yes, he invented it."] },
  { id: "gq08", unit: 6, q: "What do you want to be in the future?", answer: "I want to be an engineer.", wrong: ["I went to Guangzhou.", "It was great.", "First, then, finally."] },
];
const CLOZE_GZ = [
  { id: "gc01", unit: 3, level: 1, text: "It is time ____ go to school.", options: ["to", "for", "of", "at"], answer: "to", zh: "该去上学了。" },
  { id: "gc02", unit: 3, level: 1, text: "____ you speak English? Yes, a little.", options: ["Can", "Are", "Is", "Do be"], answer: "Can", zh: "你会说英语吗？会一点。" },
  { id: "gc03", unit: 4, level: 2, text: "The hospital is ____ the bank and the shop.", options: ["between", "behind of", "next", "in front"], answer: "between", zh: "医院在银行和商店之间。" },
  { id: "gc04", unit: 4, level: 2, text: "Look! She ____ her room.", options: ["is cleaning", "clean", "cleans to", "are cleaning"], answer: "is cleaning", zh: "看！她正在打扫房间。" },
  { id: "gc05", unit: 5, level: 2, text: "We ____ protect the environment.", options: ["should", "shall to", "are", "does"], answer: "should", zh: "我们应该保护环境。" },
  { id: "gc06", unit: 5, level: 3, text: "I feel proud ____ my school.", options: ["of", "in", "at", "for to"], answer: "of", zh: "我为我的学校感到自豪。" },
  { id: "gc07", unit: 6, level: 3, text: "Last year they ____ to Beijing.", options: ["travelled", "travel", "travels", "travelling"], answer: "travelled", zh: "去年他们去了北京。" },
  { id: "gc08", unit: 6, level: 3, text: "This computer is ____ than that one.", options: ["better", "good", "best", "more good"], answer: "better", zh: "这台电脑比那台更好。" },
];
const DIALOGUES_GZ = [
  { id: "gd01", unit: 3, level: 1,
    lines: [{ who: "Teacher", text: "Be a good listener, please." }, { who: "Ken", text: "____" }],
    options: ["OK, I will listen carefully.", "It is a red key.", "I am ten years old.", "Yes, it is a lake."],
    answer: "OK, I will listen carefully.", explain: "老师提出要求，合适的回应是表示接受。" },
  { id: "gd02", unit: 4, level: 2,
    lines: [{ who: "Shop worker", text: "Can I help you?" }, { who: "Mia", text: "____" }, { who: "Shop worker", text: "It is thirty yuan." }],
    options: ["How much is this bag?", "I am cleaning my room.", "She is very strict.", "Turn left at the bank."],
    answer: "How much is this bag?", explain: "对方回答价格，所以问句应该问 How much。" },
  { id: "gd03", unit: 5, level: 2,
    lines: [{ who: "Anna", text: "How often do you exercise?" }, { who: "Ben", text: "____" }],
    options: ["Three times a week.", "In the forest.", "Because I am shy.", "Yes, it is healthy."],
    answer: "Three times a week.", explain: "How often 问频次，要用频次表达回答。" },
  { id: "gd04", unit: 6, level: 3,
    lines: [{ who: "Leo", text: "Where did you go last holiday?" }, { who: "Sara", text: "____" }, { who: "Leo", text: "How was it?" }],
    options: ["I went to Guangzhou.", "I am going to go there.", "It is faster than a bus.", "He is an engineer."],
    answer: "I went to Guangzhou.", explain: "last holiday 是过去时间，要用一般过去时回答。" },
];
const READINGS_GZ = [
  { id: "gr01", unit: 4, level: 2, title: "My School Day",
    text: "I get up at six thirty and wash my face. I go to school by bike. My favourite subject is Science, because we do many small tests in class. After school I help my mother clean the kitchen. I go to bed at nine.",
    questions: [
      { q: "How does the writer go to school?", options: ["By bike", "By bus", "On foot", "By train"], answer: "By bike", explain: "第二句说他骑自行车上学。" },
      { q: "Why does the writer like Science?", options: ["They do small tests in class", "It is easy", "The teacher is funny", "There is no homework"], answer: "They do small tests in class", explain: "文中用 because 给出了原因。" },
    ] },
  { id: "gr02", unit: 6, level: 3, title: "The Girl Who Wanted to Fly",
    text: "When Lin was a child, she watched planes over her village every evening. She read many books about the sky. First she studied hard at school. Then she went to a college in the city. Finally, last year, she became a pilot. Now her little brother says he wants to be an engineer.",
    questions: [
      { q: "What did Lin do first?", options: ["She studied hard at school", "She became a pilot", "She moved to a village", "She bought a plane"], answer: "She studied hard at school", explain: "文中用 First 引出她最先做的事。" },
      { q: "What does her brother want to be?", options: ["An engineer", "A pilot", "A teacher", "A doctor"], answer: "An engineer", explain: "最后一句说弟弟想当工程师。" },
    ] },
];

/* ===== 教材四：2024 广东接力版（一年级起点） ===== */
const UNITS_JL = [
  { id: 1, label: "一二年级", en: "Colours, Toys & Feelings", zh: "色彩·玩具·感受" },
  { id: 3, label: "三年级", en: "School, Time & Food", zh: "校园·作息·食物" },
  { id: 4, label: "四年级", en: "Jobs, Transport & Shopping", zh: "职业·出行·购物" },
  { id: 5, label: "五年级", en: "Traits, Care & Heritage", zh: "品质·关怀·文化" },
  { id: 6, label: "六年级", en: "Past, Tech & Future", zh: "过去·科技·未来" },
];
const WORDS_JL = [
  { id: "j101", en: "red", zh: "红色", emoji: "🔴", unit: 1, group: "颜色", level: 1, sent: "Let's draw a ____ apple." },
  { id: "j102", en: "ball", zh: "球", emoji: "⚽", unit: 1, group: "玩具", level: 1, sent: "I have a new ____." },
  { id: "j103", en: "clean", zh: "打扫", emoji: "🧹", unit: 1, group: "劳动", level: 1, sent: "I can ____ the floor." },
  { id: "j104", en: "hungry", zh: "饿的", emoji: "🍽️", unit: 1, group: "感受", level: 1, sent: "The dog is ____." },
  { id: "j105", en: "nose", zh: "鼻子", emoji: "👃", unit: 1, group: "身体", level: 1, sent: "Touch your ____." },
  { id: "j301", en: "noodles", zh: "面条", emoji: "🍜", unit: 3, group: "食物", level: 1, sent: "I would like some ____." },
  { id: "j302", en: "swim", zh: "游泳", emoji: "🏊", unit: 3, group: "技能", level: 1, sent: "Can you ____ well?" },
  { id: "j303", en: "piano", zh: "钢琴", emoji: "🎹", unit: 3, group: "技能", level: 2, sent: "She plays the ____ on Sunday." },
  { id: "j304", en: "lunch", zh: "午饭", emoji: "🍱", unit: 3, group: "作息", level: 1, sent: "We eat ____ at twelve." },
  { id: "j305", en: "vegetable", zh: "蔬菜", emoji: "🥦", unit: 3, group: "食物", level: 2, sent: "Eat more ____ every day." },
  { id: "j401", en: "nurse", zh: "护士", emoji: "🧑‍⚕️", unit: 4, group: "职业", level: 1, sent: "My sister is a ____." },
  { id: "j402", en: "train", zh: "火车", emoji: "🚆", unit: 4, group: "交通", level: 1, sent: "We go there by ____." },
  { id: "j403", en: "cheap", zh: "便宜的", emoji: "🏷️", unit: 4, group: "购物", level: 2, sent: "These shoes are very ____." },
  { id: "j404", en: "between", zh: "在……之间", emoji: "↔️", unit: 4, group: "方位", level: 3, sent: "The shop is ____ two banks." },
  { id: "j405", en: "police officer", zh: "警察", emoji: "👮", unit: 4, group: "职业", level: 2, sent: "The ____ helps people." },
  { id: "j501", en: "kind", zh: "友善的", emoji: "🤗", unit: 5, group: "品质", level: 1, sent: "She is ____ to everyone." },
  { id: "j502", en: "nervous", zh: "紧张的", emoji: "😬", unit: 5, group: "情绪", level: 3, sent: "I feel ____ before the show." },
  { id: "j503", en: "heritage", zh: "文化遗产", emoji: "🏯", unit: 5, group: "文化自然", level: 3, sent: "This old town is our ____." },
  { id: "j504", en: "protect", zh: "保护", emoji: "🛡️", unit: 5, group: "文化自然", level: 2, sent: "We should ____ the river." },
  { id: "j505", en: "usually", zh: "通常", emoji: "🔁", unit: 5, group: "频次副词", level: 2, sent: "I ____ walk to school." },
  { id: "j601", en: "astronaut", zh: "宇航员", emoji: "🧑‍🚀", unit: 6, group: "梦想职业", level: 3, sent: "He wants to be an ____." },
  { id: "j602", en: "museum", zh: "博物馆", emoji: "🏛️", unit: 6, group: "地点", level: 2, sent: "We visited a ____ yesterday." },
  { id: "j603", en: "stronger", zh: "更强壮的", emoji: "💪", unit: 6, group: "比较级", level: 2, sent: "He is ____ than me." },
  { id: "j604", en: "future", zh: "未来", emoji: "🔮", unit: 6, group: "梦想职业", level: 2, sent: "What will you do in the ____?" },
  { id: "j605", en: "bought", zh: "买（过去式）", emoji: "🛍️", unit: 6, group: "过去式", level: 3, sent: "She ____ a book last week." },
];
const PHRASES_JL = [
  { id: "jp01", en: "put away", zh: "收拾好", unit: 1 },
  { id: "jp02", en: "play with", zh: "和……一起玩", unit: 1 },
  { id: "jp03", en: "go to bed", zh: "上床睡觉", unit: 3 },
  { id: "jp04", en: "play the piano", zh: "弹钢琴", unit: 3 },
  { id: "jp05", en: "on foot", zh: "步行", unit: 4 },
  { id: "jp06", en: "how much", zh: "多少钱", unit: 4 },
  { id: "jp07", en: "take care of", zh: "照顾", unit: 5 },
  { id: "jp08", en: "learn about", zh: "了解", unit: 5 },
  { id: "jp09", en: "in the end", zh: "最后", unit: 6 },
];
const SENTENCES_JL = [
  { id: "jl01", en: "I see two red balls.", zh: "我看见两个红色的球。", unit: 1, level: 1, gap: "balls" },
  { id: "jl02", en: "I can clean the floor.", zh: "我会打扫地板。", unit: 1, level: 1, gap: "clean" },
  { id: "jl03", en: "He is hungry and tired.", zh: "他又饿又累。", unit: 1, level: 1, gap: "hungry" },
  { id: "jl04", en: "Let's put the toys away.", zh: "我们把玩具收好吧。", unit: 1, level: 2, gap: "toys" },
  { id: "jl05", en: "What time is it now?", zh: "现在几点了？", unit: 3, level: 1, gap: "time" },
  { id: "jl06", en: "I would like some noodles.", zh: "我想要一些面条。", unit: 3, level: 1, gap: "noodles" },
  { id: "jl07", en: "Can you play the piano?", zh: "你会弹钢琴吗？", unit: 3, level: 2, gap: "piano" },
  { id: "jl08", en: "I often play football on weekends.", zh: "我周末常踢足球。", unit: 3, level: 2, gap: "football" },
  { id: "jl09", en: "How do you go to school?", zh: "你怎么去上学？", unit: 4, level: 1, gap: "school" },
  { id: "jl10", en: "The hospital is next to the bank.", zh: "医院在银行旁边。", unit: 4, level: 2, gap: "hospital" },
  { id: "jl11", en: "How much are these shoes?", zh: "这双鞋多少钱？", unit: 4, level: 2, gap: "shoes" },
  { id: "jl12", en: "She is polite and helpful.", zh: "她有礼貌又乐于助人。", unit: 5, level: 1, gap: "helpful" },
  { id: "jl13", en: "Why do you feel nervous?", zh: "你为什么感到紧张？", unit: 5, level: 3, gap: "nervous" },
  { id: "jl14", en: "We should learn about our culture.", zh: "我们应该了解自己的文化。", unit: 5, level: 3, gap: "culture" },
  { id: "jl15", en: "Where did you go yesterday?", zh: "你昨天去哪儿了？", unit: 6, level: 2, gap: "yesterday" },
  { id: "jl16", en: "I am going to be a scientist.", zh: "我打算成为科学家。", unit: 6, level: 3, gap: "scientist" },
];
const QA_JL = [
  { id: "jq01", unit: 1, q: "How do you feel?", answer: "I am happy.", wrong: ["It is a ball.", "Yes, two.", "Under the bed."] },
  { id: "jq02", unit: 1, q: "Where is my ball?", answer: "It is under the bed.", wrong: ["I am hungry.", "It is red apple.", "Yes, I can clean."] },
  { id: "jq03", unit: 3, q: "What would you like?", answer: "I would like some rice.", wrong: ["It is seven o'clock.", "By train.", "She is kind."] },
  { id: "jq04", unit: 3, q: "Can you swim?", answer: "Yes, a little.", wrong: ["It is cheap.", "In the museum.", "Because I am tired."] },
  { id: "jq05", unit: 4, q: "What does your father do?", answer: "He is a police officer.", wrong: ["He is at home.", "Twenty yuan.", "Yes, he did."] },
  { id: "jq06", unit: 4, q: "How much is this bag?", answer: "Forty yuan.", wrong: ["It is a train.", "Next to the shop.", "I usually walk."] },
  { id: "jq07", unit: 5, q: "What is your friend like?", answer: "She is kind and quiet.", wrong: ["She is in the park.", "Last Sunday.", "Yes, she can."] },
  { id: "jq08", unit: 6, q: "What did you buy yesterday?", answer: "I bought a new book.", wrong: ["I am going to read.", "He is stronger.", "In the future."] },
];
const CLOZE_JL = [
  { id: "jc01", unit: 1, level: 1, text: "Let's draw a ____ dog.", options: ["blue", "blow", "below", "bloom"], answer: "blue", zh: "我们画一只蓝色的狗吧。" },
  { id: "jc02", unit: 1, level: 1, text: "My ball is ____ the desk.", options: ["under", "unde", "onder", "undor"], answer: "under", zh: "我的球在桌子下面。" },
  { id: "jc03", unit: 3, level: 1, text: "It is time ____ go home.", options: ["to", "for", "at", "of"], answer: "to", zh: "该回家了。" },
  { id: "jc04", unit: 3, level: 2, text: "I would like ____ noodles.", options: ["some", "a", "much", "any of"], answer: "some", zh: "我想要一些面条。" },
  { id: "jc05", unit: 4, level: 2, text: "I go to school ____ foot.", options: ["on", "by", "in", "with"], answer: "on", zh: "我步行上学。" },
  { id: "jc06", unit: 4, level: 2, text: "The park is ____ the school and the bank.", options: ["between", "next", "front", "behind of"], answer: "between", zh: "公园在学校和银行之间。" },
  { id: "jc07", unit: 5, level: 2, text: "There ____ many old buildings here.", options: ["are", "is", "be", "has"], answer: "are", zh: "这里有很多老建筑。" },
  { id: "jc08", unit: 6, level: 3, text: "Last week we ____ to the museum.", options: ["went", "go", "goes", "going"], answer: "went", zh: "上周我们去了博物馆。" },
];
const DIALOGUES_JL = [
  { id: "jd01", unit: 1, level: 1,
    lines: [{ who: "Mum", text: "Can you help me?" }, { who: "Kit", text: "____" }],
    options: ["Yes, I can clean the table.", "It is a red ball.", "I am six years old.", "No, it is under the bed."],
    answer: "Yes, I can clean the table.", explain: "对方请求帮忙，回应要说明自己能做什么。" },
  { id: "jd02", unit: 3, level: 1,
    lines: [{ who: "Waiter", text: "What would you like?" }, { who: "Amy", text: "____" }],
    options: ["I would like some noodles.", "It is nine o'clock.", "Yes, I can swim.", "She is my sister."],
    answer: "I would like some noodles.", explain: "点餐时用 I would like ... 表达想要的食物。" },
  { id: "jd03", unit: 4, level: 2,
    lines: [{ who: "Tom", text: "____" }, { who: "Lily", text: "I go to school by bus." }],
    options: ["How do you go to school?", "How much is it?", "What is your father?", "Where is the bank?"],
    answer: "How do you go to school?", explain: "回答说明的是交通方式，用 How 提问。" },
  { id: "jd04", unit: 5, level: 3,
    lines: [{ who: "Teacher", text: "How can we protect the old town?" }, { who: "Zoe", text: "____" }],
    options: ["We should keep it clean.", "I bought a book.", "He is stronger than me.", "It is twenty yuan."],
    answer: "We should keep it clean.", explain: "问的是做法，用 should 给出具体建议。" },
];
const READINGS_JL = [
  { id: "jr01", unit: 3, level: 2, title: "Saturday Morning",
    text: "On Saturday morning, Kit gets up at seven. He eats bread and drinks milk. Then he plays football with his friends in the park. At twelve he goes home and helps his mother make lunch. In the afternoon he plays the piano for half an hour.",
    questions: [
      { q: "What does Kit do in the park?", options: ["He plays football", "He reads books", "He rides a bike", "He feeds the birds"], answer: "He plays football", explain: "文中说他和朋友在公园踢足球。" },
      { q: "What does he do in the afternoon?", options: ["Plays the piano", "Cleans his room", "Goes swimming", "Visits a museum"], answer: "Plays the piano", explain: "最后一句说下午弹半小时钢琴。" },
    ] },
  { id: "jr02", unit: 5, level: 3, title: "The Old Street",
    text: "There is an old street near my home. The houses are more than a hundred years old. Last spring, some workers cleaned the walls and fixed the roofs. Now many visitors come here on weekends. My grandmother says we should take care of the street, because it is part of our culture.",
    questions: [
      { q: "What did the workers do last spring?", options: ["Cleaned the walls and fixed the roofs", "Built a new school", "Planted many trees", "Opened a museum"], answer: "Cleaned the walls and fixed the roofs", explain: "文中第三句说明了工人们做的事。" },
      { q: "Why should people take care of the street?", options: ["It is part of their culture", "It is very short", "It is near the school", "It has many shops"], answer: "It is part of their culture", explain: "最后一句用 because 给出了理由。" },
    ] },
];

/* ===== 教材五：美国本土小学 Wonders / HMH 体系（GK-G6） ===== */
const UNITS_US = [
  { id: 1, label: "GK–G1", en: "Phonics & Sight Words", zh: "自然拼读·高频词" },
  { id: 2, label: "G2–G3", en: "Reading Skills", zh: "阅读策略·词根词缀" },
  { id: 3, label: "G4–G5", en: "Analysis & Academic", zh: "文本分析·学术词汇" },
  { id: 4, label: "G6", en: "Critical Reading", zh: "批判阅读·修辞" },
];
const WORDS_US = [
  { id: "u101", en: "see", zh: "看见", emoji: "👀", unit: 1, group: "高频词", level: 1, sent: "I ____ a big ship." },
  { id: "u102", en: "play", zh: "玩", emoji: "🧸", unit: 1, group: "高频词", level: 1, sent: "We ____ in the park." },
  { id: "u103", en: "cat", zh: "猫", emoji: "🐱", unit: 1, group: "CVC 短元音", level: 1, sent: "The ____ can nap." },
  { id: "u104", en: "ship", zh: "船", emoji: "🚢", unit: 1, group: "复合辅音", level: 1, sent: "The ____ is very big." },
  { id: "u105", en: "cake", zh: "蛋糕", emoji: "🎂", unit: 1, group: "长元音", level: 1, sent: "This ____ is for mom." },
  { id: "u106", en: "sheep", zh: "绵羊", emoji: "🐑", unit: 1, group: "长元音", level: 2, sent: "Ten ____ are on the hill." },
  { id: "u201", en: "author", zh: "作者", emoji: "✍️", unit: 2, group: "阅读策略", level: 2, sent: "The ____ wants to teach us." },
  { id: "u202", en: "detail", zh: "细节", emoji: "🔎", unit: 2, group: "阅读策略", level: 2, sent: "Find one key ____ here." },
  { id: "u203", en: "problem", zh: "问题", emoji: "❗", unit: 2, group: "阅读策略", level: 2, sent: "What is the ____ in the story?" },
  { id: "u204", en: "solution", zh: "解决办法", emoji: "🔧", unit: 2, group: "阅读策略", level: 3, sent: "The ____ comes at the end." },
  { id: "u205", en: "opinion", zh: "观点", emoji: "💬", unit: 2, group: "阅读策略", level: 3, sent: "This sentence is an ____." },
  { id: "u206", en: "careful", zh: "小心的", emoji: "🧐", unit: 2, group: "词根词缀", level: 2, sent: "Be ____ with the glass." },
  { id: "u301", en: "theme", zh: "主题思想", emoji: "🎯", unit: 3, group: "文学分析", level: 3, sent: "The ____ is about courage." },
  { id: "u302", en: "evidence", zh: "证据", emoji: "🔍", unit: 3, group: "学术词汇", level: 3, sent: "Give ____ from the text." },
  { id: "u303", en: "compare", zh: "比较", emoji: "⚖️", unit: 3, group: "学术词汇", level: 2, sent: "____ the two characters." },
  { id: "u304", en: "structure", zh: "结构", emoji: "🧱", unit: 3, group: "学术词汇", level: 3, sent: "This text uses a clear ____." },
  { id: "u305", en: "metaphor", zh: "暗喻", emoji: "🎭", unit: 3, group: "文学分析", level: 3, sent: "The writer uses a ____ here." },
  { id: "u306", en: "summarize", zh: "概括", emoji: "📝", unit: 3, group: "学术词汇", level: 3, sent: "Please ____ the last page." },
  { id: "u401", en: "bias", zh: "偏见", emoji: "⚠️", unit: 4, group: "批判阅读", level: 3, sent: "Look for ____ in this report." },
  { id: "u402", en: "tone", zh: "语气", emoji: "🎚️", unit: 4, group: "修辞", level: 3, sent: "The writer's ____ is serious." },
  { id: "u403", en: "argument", zh: "论点", emoji: "🗣️", unit: 4, group: "批判阅读", level: 3, sent: "A strong ____ needs evidence." },
  { id: "u404", en: "symbol", zh: "象征", emoji: "♟️", unit: 4, group: "修辞", level: 3, sent: "The river is a ____ of time." },
  { id: "u405", en: "persuade", zh: "说服", emoji: "🤝", unit: 4, group: "批判阅读", level: 3, sent: "The writer wants to ____ us." },
  { id: "u406", en: "analyze", zh: "分析", emoji: "🧪", unit: 4, group: "批判阅读", level: 3, sent: "____ the data before you write." },
];
const PHRASES_US = [
  { id: "up01", en: "sight words", zh: "高频词", unit: 1 },
  { id: "up02", en: "look at", zh: "看着", unit: 1 },
  { id: "up03", en: "main idea", zh: "主旨", unit: 2 },
  { id: "up04", en: "cause and effect", zh: "因果关系", unit: 2 },
  { id: "up05", en: "context clues", zh: "上下文线索", unit: 2 },
  { id: "up06", en: "point of view", zh: "叙述视角", unit: 3 },
  { id: "up07", en: "text evidence", zh: "文本证据", unit: 3 },
  { id: "up08", en: "logical fallacy", zh: "逻辑谬误", unit: 4 },
];
const SENTENCES_US = [
  { id: "us01", en: "I see a big ship.", zh: "我看见一艘大船。", unit: 1, level: 1, gap: "ship" },
  { id: "us02", en: "The cat can nap on the mat.", zh: "猫可以在垫子上打盹。", unit: 1, level: 1, gap: "cat" },
  { id: "us03", en: "We like to play outside.", zh: "我们喜欢在外面玩。", unit: 1, level: 1, gap: "play" },
  { id: "us04", en: "This cake is for my mom.", zh: "这个蛋糕是给我妈妈的。", unit: 1, level: 1, gap: "cake" },
  { id: "us05", en: "The author wants to teach us something.", zh: "作者想教给我们一些东西。", unit: 2, level: 2, gap: "author" },
  { id: "us06", en: "Use context clues to find the meaning.", zh: "用上下文线索找出词义。", unit: 2, level: 3, gap: "meaning" },
  { id: "us07", en: "This story has a problem and a solution.", zh: "这个故事有问题也有解决办法。", unit: 2, level: 2, gap: "solution" },
  { id: "us08", en: "A fact can be proved, but an opinion cannot.", zh: "事实可以被证明，观点不能。", unit: 2, level: 3, gap: "opinion" },
  { id: "us09", en: "The theme of the story is friendship.", zh: "这个故事的主题是友谊。", unit: 3, level: 3, gap: "theme" },
  { id: "us10", en: "Give evidence from the text.", zh: "请从文本中给出证据。", unit: 3, level: 2, gap: "evidence" },
  { id: "us11", en: "Compare the two characters carefully.", zh: "仔细比较这两个人物。", unit: 3, level: 3, gap: "compare" },
  { id: "us12", en: "The writer uses a metaphor here.", zh: "作者在这里用了一个暗喻。", unit: 3, level: 3, gap: "metaphor" },
  { id: "us13", en: "The writer's tone is serious.", zh: "作者的语气是严肃的。", unit: 4, level: 3, gap: "tone" },
  { id: "us14", en: "A strong argument needs good evidence.", zh: "有力的论点需要好的证据。", unit: 4, level: 3, gap: "argument" },
  { id: "us15", en: "The river is a symbol of time.", zh: "这条河象征着时间。", unit: 4, level: 3, gap: "symbol" },
  { id: "us16", en: "Analyze the data before you write.", zh: "写之前先分析数据。", unit: 4, level: 3, gap: "data" },
];
const QA_US = [
  { id: "uq01", unit: 1, q: "What do you see?", answer: "I see a red cat.", wrong: ["It is Monday.", "Yes, I can.", "Because it is fun."] },
  { id: "uq02", unit: 1, q: "Where are the sheep?", answer: "They are on the hill.", wrong: ["It is a cake.", "I like to play.", "Ten years old."] },
  { id: "uq03", unit: 2, q: "What is the main idea?", answer: "Bees help plants grow.", wrong: ["On page ten.", "Yes, it is true.", "In the morning."] },
  { id: "uq04", unit: 2, q: "Is that a fact or an opinion?", answer: "It is an opinion.", wrong: ["It is a ship.", "Three details.", "At the library."] },
  { id: "uq05", unit: 3, q: "What is the theme of the story?", answer: "Never give up.", wrong: ["Page fourteen.", "The second chapter.", "Yes, it is long."] },
  { id: "uq06", unit: 3, q: "How can you support your answer?", answer: "With evidence from the text.", wrong: ["With a new story.", "By reading faster.", "Because it is short."] },
  { id: "uq07", unit: 4, q: "What is the writer's tone here?", answer: "Serious and worried.", wrong: ["A long paragraph.", "In the last line.", "Yes, it is a symbol."] },
  { id: "uq08", unit: 4, q: "Why does the writer use this word?", answer: "To persuade the reader.", wrong: ["Because it is short.", "To end the page.", "It is a sight word."] },
];
const CLOZE_US = [
  { id: "uc01", unit: 1, level: 1, text: "The ____ is on the mat.", options: ["cat", "cut", "cot", "kat"], answer: "cat", zh: "猫在垫子上。" },
  { id: "uc02", unit: 1, level: 1, text: "I ____ two big ships.", options: ["see", "sea", "sees", "seen"], answer: "see", zh: "我看见两艘大船。" },
  { id: "uc03", unit: 2, level: 2, text: "The ____ idea is in the first line.", options: ["main", "mean", "many", "mine"], answer: "main", zh: "主旨在第一句。" },
  { id: "uc04", unit: 2, level: 3, text: "Be ____ when you cross the street.", options: ["careful", "careless", "carely", "carefulness"], answer: "careful", zh: "过马路时要小心。" },
  { id: "uc05", unit: 3, level: 3, text: "Use text ____ to support your idea.", options: ["evidence", "evident", "evidently", "evidences of"], answer: "evidence", zh: "用文本证据支持你的观点。" },
  { id: "uc06", unit: 3, level: 3, text: "The two stories are easy to ____.", options: ["compare", "comparing", "compares", "comparison"], answer: "compare", zh: "这两个故事容易比较。" },
  { id: "uc07", unit: 4, level: 3, text: "The article shows a clear ____ against the plan.", options: ["bias", "base", "bias of be", "biased"], answer: "bias", zh: "这篇文章对该计划有明显偏见。" },
  { id: "uc08", unit: 4, level: 3, text: "The dove is a ____ of peace.", options: ["symbol", "sample", "simple", "symbolic"], answer: "symbol", zh: "鸽子是和平的象征。" },
];
const DIALOGUES_US = [
  { id: "ud01", unit: 1, level: 1,
    lines: [{ who: "Teacher", text: "What do you see in the picture?" }, { who: "Sam", text: "____" }],
    options: ["I see a big ship.", "It is Tuesday.", "Yes, I am six.", "She is my mom."],
    answer: "I see a big ship.", explain: "问句是 What do you see，回答要说看到的东西。" },
  { id: "ud02", unit: 2, level: 2,
    lines: [{ who: "Teacher", text: "What is the problem in the story?" }, { who: "Mia", text: "____" }],
    options: ["The bird cannot find its nest.", "It has ten pages.", "I like the pictures.", "Yes, it is a fact."],
    answer: "The bird cannot find its nest.", explain: "问故事中的问题，要说明具体困难。" },
  { id: "ud03", unit: 3, level: 3,
    lines: [{ who: "Teacher", text: "How do you know the character changed?" }, { who: "Leo", text: "____" }],
    options: ["On page twelve he says sorry.", "It is a long book.", "I read it yesterday.", "The tone is funny."],
    answer: "On page twelve he says sorry.", explain: "要用具体的文本证据来支持判断。" },
  { id: "ud04", unit: 4, level: 3,
    lines: [{ who: "Teacher", text: "Is this source reliable?" }, { who: "Ava", text: "____" }],
    options: ["No, it gives only one side.", "Yes, it is very long.", "It has nice pictures.", "I found it last week."],
    answer: "No, it gives only one side.", explain: "判断可靠性要看是否呈现多方观点。" },
];
const READINGS_US = [
  { id: "ur01", unit: 2, level: 2, title: "Why Bees Matter",
    text: "Bees are small, but they do a big job. They fly from flower to flower and carry pollen. This helps plants make fruit and seeds. In some places, there are fewer bees than before. Farmers now plant more wild flowers so bees have more food. Small changes can solve big problems.",
    questions: [
      { q: "What is the main idea?", options: ["Bees help plants grow", "Bees are dangerous", "Farmers dislike bees", "Flowers are colourful"], answer: "Bees help plants grow", explain: "全文围绕蜜蜂帮助植物结果这一中心。" },
      { q: "What is one solution in the text?", options: ["Planting more wild flowers", "Keeping bees indoors", "Growing fewer plants", "Using more machines"], answer: "Planting more wild flowers", explain: "文中说农民种更多野花给蜜蜂提供食物。" },
    ] },
  { id: "ur02", unit: 4, level: 3, title: "Two Views on Screen Time",
    text: "One writer says screens harm young readers. She points to a study of 200 students. Another writer disagrees. He says students now read more short texts online than ever before. Both writers use numbers, but only one of them names the source of the data. A careful reader checks where the numbers come from.",
    questions: [
      { q: "What do both writers use?", options: ["Numbers", "Photos", "Interviews", "Poems"], answer: "Numbers", explain: "文中说两位作者都用了数字。" },
      { q: "What should a careful reader do?", options: ["Check the source of the data", "Trust the longer article", "Read only the first line", "Ignore both writers"], answer: "Check the source of the data", explain: "最后一句给出了这个建议。" },
    ] },
];

/* ===== 教材六：国际 ESL 体系（CEFR A1-B2） ===== */
const UNITS_ESL = [
  { id: 1, label: "A1", en: "Starters · Everyday Basics", zh: "入门·日常交流" },
  { id: 2, label: "A2", en: "Movers · Routines & Rules", zh: "进阶·习惯与规则" },
  { id: 3, label: "B1", en: "PET · Experience & Ideas", zh: "中级·经历与观点" },
  { id: 4, label: "B2", en: "FCE · Analysis & Argument", zh: "中高级·分析与论证" },
];
const WORDS_ESL = [
  { id: "e101", en: "teacher", zh: "老师", emoji: "🧑‍🏫", unit: 1, group: "人与身份", level: 1, sent: "This is my ____." },
  { id: "e102", en: "apple", zh: "苹果", emoji: "🍎", unit: 1, group: "食物", level: 1, sent: "I have got an ____." },
  { id: "e103", en: "under", zh: "在……下面", emoji: "⬇️", unit: 1, group: "方位介词", level: 1, sent: "The dog is ____ the table." },
  { id: "e104", en: "blue", zh: "蓝色", emoji: "🔵", unit: 1, group: "颜色", level: 1, sent: "Her bag is ____." },
  { id: "e105", en: "family", zh: "家庭", emoji: "👪", unit: 1, group: "人与身份", level: 1, sent: "My ____ is small." },
  { id: "e106", en: "rainy", zh: "下雨的", emoji: "🌧️", unit: 1, group: "天气", level: 2, sent: "It is cold and ____." },
  { id: "e201", en: "routine", zh: "日常安排", emoji: "🗓️", unit: 2, group: "日常", level: 2, sent: "Tell me about your morning ____." },
  { id: "e202", en: "jungle", zh: "丛林", emoji: "🌴", unit: 2, group: "栖息地", level: 2, sent: "Monkeys live in the ____." },
  { id: "e203", en: "ocean", zh: "海洋", emoji: "🌊", unit: 2, group: "栖息地", level: 2, sent: "Whales live in the ____." },
  { id: "e204", en: "clothes", zh: "衣服", emoji: "👕", unit: 2, group: "生活", level: 1, sent: "Put your ____ in the box." },
  { id: "e205", en: "usually", zh: "通常", emoji: "🔁", unit: 2, group: "频次副词", level: 2, sent: "She ____ walks to work." },
  { id: "e206", en: "must", zh: "必须", emoji: "❗", unit: 2, group: "情态动词", level: 2, sent: "You ____ wear a helmet." },
  { id: "e301", en: "ecosystem", zh: "生态系统", emoji: "🌱", unit: 3, group: "科学主题", level: 3, sent: "A forest is a large ____." },
  { id: "e302", en: "invention", zh: "发明", emoji: "💡", unit: 3, group: "科技", level: 2, sent: "The wheel was an early ____." },
  { id: "e303", en: "ancient", zh: "古代的", emoji: "🏛️", unit: 3, group: "历史", level: 3, sent: "We studied an ____ city." },
  { id: "e304", en: "recycle", zh: "回收利用", emoji: "♻️", unit: 3, group: "环境", level: 2, sent: "We ____ paper at school." },
  { id: "e305", en: "pollution", zh: "污染", emoji: "🏭", unit: 3, group: "环境", level: 3, sent: "Air ____ is a big problem." },
  { id: "e306", en: "experience", zh: "经历", emoji: "🧳", unit: 3, group: "抽象名词", level: 3, sent: "It was a great ____." },
  { id: "e401", en: "justice", zh: "公正", emoji: "⚖️", unit: 4, group: "抽象概念", level: 3, sent: "The book is about ____." },
  { id: "e402", en: "evidence", zh: "证据", emoji: "🔍", unit: 4, group: "学术论证", level: 3, sent: "There is little ____ for that." },
  { id: "e403", en: "global", zh: "全球的", emoji: "🌐", unit: 4, group: "全球议题", level: 3, sent: "This is a ____ issue." },
  { id: "e404", en: "freedom", zh: "自由", emoji: "🕊️", unit: 4, group: "抽象概念", level: 3, sent: "They wrote about ____." },
  { id: "e405", en: "consequently", zh: "因此", emoji: "➡️", unit: 4, group: "学术连接词", level: 3, sent: "____, the plan failed." },
  { id: "e406", en: "renewable", zh: "可再生的", emoji: "🔋", unit: 4, group: "全球议题", level: 3, sent: "Wind is a ____ energy source." },
];
const PHRASES_ESL = [
  { id: "ep01", en: "have got", zh: "有", unit: 1 },
  { id: "ep02", en: "next to", zh: "在……旁边", unit: 1 },
  { id: "ep03", en: "get up", zh: "起床", unit: 2 },
  { id: "ep04", en: "be going to", zh: "打算做", unit: 2 },
  { id: "ep05", en: "look after", zh: "照顾", unit: 3 },
  { id: "ep06", en: "used to", zh: "过去常常", unit: 3 },
  { id: "ep07", en: "on the other hand", zh: "另一方面", unit: 4 },
  { id: "ep08", en: "take responsibility for", zh: "为……负责", unit: 4 },
];
const SENTENCES_ESL = [
  { id: "es01", en: "This is my teacher.", zh: "这是我的老师。", unit: 1, level: 1, gap: "teacher" },
  { id: "es02", en: "The dog is under the table.", zh: "狗在桌子下面。", unit: 1, level: 1, gap: "under" },
  { id: "es03", en: "I have got two apples.", zh: "我有两个苹果。", unit: 1, level: 1, gap: "apples" },
  { id: "es04", en: "Can you swim well?", zh: "你游泳好吗？", unit: 1, level: 1, gap: "swim" },
  { id: "es05", en: "She always gets up at seven.", zh: "她总是七点起床。", unit: 2, level: 2, gap: "seven" },
  { id: "es06", en: "They are playing football now.", zh: "他们现在正在踢足球。", unit: 2, level: 2, gap: "playing" },
  { id: "es07", en: "You mustn't run in the hall.", zh: "你不可以在走廊里跑。", unit: 2, level: 2, gap: "run" },
  { id: "es08", en: "There is some milk in the fridge.", zh: "冰箱里有一些牛奶。", unit: 2, level: 2, gap: "milk" },
  { id: "es09", en: "I have never been to Japan.", zh: "我从没去过日本。", unit: 3, level: 3, gap: "never" },
  { id: "es10", en: "If it rains, we will stay at home.", zh: "如果下雨，我们就待在家里。", unit: 3, level: 3, gap: "rains" },
  { id: "es11", en: "The bridge was built in 1920.", zh: "这座桥建于 1920 年。", unit: 3, level: 3, gap: "built" },
  { id: "es12", en: "He used to live near the sea.", zh: "他过去住在海边。", unit: 3, level: 3, gap: "used" },
  { id: "es13", en: "The report had been finished before the meeting.", zh: "报告在会议前就已完成。", unit: 4, level: 3, gap: "finished" },
  { id: "es14", en: "We should have left earlier.", zh: "我们本该早点出发。", unit: 4, level: 3, gap: "earlier" },
  { id: "es15", en: "Furthermore, the data supports this idea.", zh: "此外，数据支持这个观点。", unit: 4, level: 3, gap: "data" },
  { id: "es16", en: "If I had known, I would have told you.", zh: "如果我早知道，我就告诉你了。", unit: 4, level: 3, gap: "known" },
];
const QA_ESL = [
  { id: "eq01", unit: 1, q: "Where is your bag?", answer: "It is under the desk.", wrong: ["I am fine, thanks.", "Yes, I have got one.", "She is a teacher."] },
  { id: "eq02", unit: 1, q: "What colour is her coat?", answer: "It is blue.", wrong: ["At eight o'clock.", "Because it is cold.", "I have got two."] },
  { id: "eq03", unit: 2, q: "How often do you go swimming?", answer: "Twice a week.", wrong: ["In the ocean.", "Yes, I must.", "It is my routine book."] },
  { id: "eq04", unit: 2, q: "What are they doing now?", answer: "They are playing football.", wrong: ["They played yesterday.", "Every Sunday.", "Yes, they must."] },
  { id: "eq05", unit: 3, q: "Have you ever been abroad?", answer: "Yes, I have been to Thailand.", wrong: ["I go every day.", "It was built in 1920.", "No, I am not."] },
  { id: "eq06", unit: 3, q: "What will happen if we do nothing?", answer: "Pollution will get worse.", wrong: ["It used to be clean.", "Yes, I recycle.", "In ancient times."] },
  { id: "eq07", unit: 4, q: "What is the main weakness of the argument?", answer: "It relies on very little evidence.", wrong: ["It is too short to read.", "The writer is famous.", "It was published online."] },
  { id: "eq08", unit: 4, q: "What would you have done differently?", answer: "I would have asked for more data.", wrong: ["I will ask tomorrow.", "Yes, I agree.", "Consequently, it failed."] },
];
const CLOZE_ESL = [
  { id: "ec01", unit: 1, level: 1, text: "She ____ got a new bike.", options: ["has", "have", "is", "does"], answer: "has", zh: "她有一辆新自行车。" },
  { id: "ec02", unit: 1, level: 1, text: "The cat is ____ the chair.", options: ["under", "of", "to", "from"], answer: "under", zh: "猫在椅子下面。" },
  { id: "ec03", unit: 2, level: 2, text: "He ____ goes to bed before ten.", options: ["usually", "usual", "use to", "as usual to"], answer: "usually", zh: "他通常十点前睡觉。" },
  { id: "ec04", unit: 2, level: 2, text: "You ____ touch that machine.", options: ["mustn't", "don't must", "not must", "mustn't to"], answer: "mustn't", zh: "你不可以碰那台机器。" },
  { id: "ec05", unit: 3, level: 3, text: "I have lived here ____ 2019.", options: ["since", "for", "from", "during"], answer: "since", zh: "我从 2019 年起就住在这里。" },
  { id: "ec06", unit: 3, level: 3, text: "The letter ____ yesterday morning.", options: ["was sent", "sent", "is sending", "has sent"], answer: "was sent", zh: "这封信昨天上午寄出了。" },
  { id: "ec07", unit: 4, level: 3, text: "If she had studied, she ____ the exam.", options: ["would have passed", "would pass", "will pass", "had passed"], answer: "would have passed", zh: "如果她当时学习了，就会通过考试。" },
  { id: "ec08", unit: 4, level: 3, text: "The costs rose; ____, the project stopped.", options: ["consequently", "however", "although", "despite"], answer: "consequently", zh: "成本上升，因此项目停止了。" },
];
const DIALOGUES_ESL = [
  { id: "ed01", unit: 1, level: 1,
    lines: [{ who: "Anna", text: "Have you got a pet?" }, { who: "Ben", text: "____" }],
    options: ["Yes, I have got a cat.", "It is under the desk.", "She is my teacher.", "At six o'clock."],
    answer: "Yes, I have got a cat.", explain: "Have you got ...? 用 Yes, I have got ... 回答。" },
  { id: "ed02", unit: 2, level: 2,
    lines: [{ who: "Coach", text: "You mustn't eat before training." }, { who: "Sam", text: "____" }],
    options: ["OK, I'll eat afterwards.", "I ate yesterday.", "It is in the jungle.", "Twice a week, usually."],
    answer: "OK, I'll eat afterwards.", explain: "对方给出规则，回应要表示接受并说明打算。" },
  { id: "ed03", unit: 3, level: 3,
    lines: [{ who: "Mia", text: "Have you ever visited an ancient city?" }, { who: "Leo", text: "____" }, { who: "Mia", text: "What was it like?" }],
    options: ["Yes, I went to Xi'an two years ago.", "I will go every week.", "It is being built now.", "No, I am not going."],
    answer: "Yes, I went to Xi'an two years ago.", explain: "现在完成时提问，回答可用过去时补充具体时间。" },
  { id: "ed04", unit: 4, level: 3,
    lines: [{ who: "Tutor", text: "Your essay needs a stronger conclusion." }, { who: "Zoe", text: "____" }],
    options: ["I see. I'll add a clear summary of my evidence.", "Yes, it is very long.", "I wrote it last night.", "The tone is funny."],
    answer: "I see. I'll add a clear summary of my evidence.", explain: "收到写作反馈，合适的回应是说明具体改进方式。" },
];
const READINGS_ESL = [
  { id: "er01", unit: 2, level: 2, title: "A Day in the Rainforest",
    text: "Maria works in a rainforest park. She gets up at five and checks the paths. In the morning she counts birds. She says the forest is never quiet: insects, frogs and monkeys all make noise. Visitors mustn't feed the animals, because human food makes them ill.",
    questions: [
      { q: "What does Maria do in the morning?", options: ["She counts birds", "She cooks for visitors", "She feeds monkeys", "She cleans the office"], answer: "She counts birds", explain: "文中说她上午数鸟。" },
      { q: "Why mustn't visitors feed the animals?", options: ["Human food makes them ill", "The animals are not hungry", "It costs too much", "The park is too small"], answer: "Human food makes them ill", explain: "最后一句用 because 说明了原因。" },
    ] },
  { id: "er02", unit: 4, level: 3, title: "Energy Choices",
    text: "Many cities have promised to use renewable energy by 2035. Wind and solar power are now cheaper than they were ten years ago. However, storing that energy is still expensive. Some experts argue that saving energy matters more than producing it. Consequently, several cities have started with simple steps, such as better insulation in old buildings.",
    questions: [
      { q: "What is still expensive?", options: ["Storing energy", "Building wind farms", "Solar panels", "Old buildings"], answer: "Storing energy", explain: "第三句指出储能仍然昂贵。" },
      { q: "What have several cities started with?", options: ["Simple steps like insulation", "Closing all factories", "Banning cars", "Buying new land"], answer: "Simple steps like insulation", explain: "最后一句给出了具体做法。" },
    ] },
];

/* ===== 教材注册表 ===== */
const CURRICULA = [
  {
    id: "pep", name: "人教版 PEP", sub: "2024 秋 · 三至六年级", tag: "国内教材",
    note: "覆盖 3-6 年级共 8 册。基于官方目录整理，扩展了词汇、例句、听力、阅读与对话。",
    bank: { defaultUnit: 51, units: UNITS_PEP, words: WORDS_PEP, phrases: PHRASES_PEP, sentences: SENTENCES_PEP, qa: QA_PEP, cloze: CLOZE_PEP, dialogues: DIALOGUES_PEP, readings: READINGS_PEP },
  },
  {
    id: "bnu", name: "北师大版", sub: "五年级上册（一起点）", tag: "国内教材",
    note: "Unit 1-6：朋友、情绪、学习与娱乐、健康习惯、食物、自然",
    bank: { units: UNITS_BNU, words: WORDS_BNU, phrases: PHRASES_BNU, sentences: SENTENCES_BNU, qa: QA_PAIRS_BNU, cloze: CLOZE_BNU, dialogues: DIALOGUES_BNU, readings: READINGS_BNU },
  },
  {
    id: "gz", name: "广州教科版", sub: "2024 · 三至六年级", tag: "地区教材",
    note: "信息素养起步，四年级起加入学科、场所、购物与现在进行时",
    bank: { units: UNITS_GZ, words: WORDS_GZ, phrases: PHRASES_GZ, sentences: SENTENCES_GZ, qa: QA_GZ, cloze: CLOZE_GZ, dialogues: DIALOGUES_GZ, readings: READINGS_GZ },
  },
  {
    id: "jl", name: "广东接力版", sub: "2024 · 一年级起点", tag: "地区教材",
    note: "从一二年级启蒙词汇起步，五年级加入岭南文化与生态主题",
    bank: { units: UNITS_JL, words: WORDS_JL, phrases: PHRASES_JL, sentences: SENTENCES_JL, qa: QA_JL, cloze: CLOZE_JL, dialogues: DIALOGUES_JL, readings: READINGS_JL },
  },
  {
    id: "us", name: "美国本土小学", sub: "Wonders / HMH · GK–G6", tag: "海外体系",
    note: "自然拼读 → 阅读策略 → 文本分析 → 批判阅读，偏学术词汇",
    bank: { units: UNITS_US, words: WORDS_US, phrases: PHRASES_US, sentences: SENTENCES_US, qa: QA_US, cloze: CLOZE_US, dialogues: DIALOGUES_US, readings: READINGS_US },
  },
  {
    id: "esl", name: "国际 ESL", sub: "CEFR A1–B2 · 剑桥体系", tag: "海外体系",
    note: "A1 日常交流 → A2 习惯规则 → B1 经历观点 → B2 分析论证",
    bank: { units: UNITS_ESL, words: WORDS_ESL, phrases: PHRASES_ESL, sentences: SENTENCES_ESL, qa: QA_ESL, cloze: CLOZE_ESL, dialogues: DIALOGUES_ESL, readings: READINGS_ESL },
  },
];

const CURRICULUM_BY_ID = Object.fromEntries(CURRICULA.map((c) => [c.id, c]));

// 当前生效的题库。切换教材时先调用 setCurriculum，再更新 React 状态触发重绘。
let BANK = CURRICULA[0].bank;
let ACTIVE_CURRICULUM = CURRICULA[0];
function setCurriculum(id) {
  const c = CURRICULUM_BY_ID[id] || CURRICULA[0];
  ACTIVE_CURRICULUM = c;
  BANK = c.bank;
  return c;
}

/* ---------------------------------------------------------------------
   2. 猫咪角色设定
   --------------------------------------------------------------------- */

const CATS = [
  {
    id: "mulan",
    name: "木兰",
    en: "Mulan",
    breed: "银斑纹英国短毛猫",
    pattern: "silvertabby",
    hero: true,
    trait: "表情严肃，话不多；你连着两天不来，她会在门口坐着等",
    ability: "看词识义 · 词形辨认 · 词组搭配",
    region: "木兰的词语集市",
    color: "#5A6573",
    soft: "#EDEFF3",
    fur: "#C2C8D1",
    fur2: "#5E6673",
    eye: "#E0A93A",
    kind: "word",
    unlock: { type: "start", text: "主角伙伴" },
    stages: [
      { name: "木兰的认词摊位", level: 1, size: 6 },
      { name: "木兰的词形辨认", level: 2, size: 6 },
      { name: "木兰的词组小考", level: 3, size: 7 },
    ],
    praise: ["对了。木兰点了下头，尾巴尖动了一下。", "稳。这个词你已经拿下了。", "反应挺快，木兰装作没在看。"],
    comfort: ["差一点。看一眼正确答案再往下走。", "这个词有点狡猾，木兰先替你记下了。", "没事，这种词她自己也要看两遍。"],
  },
  {
    id: "echo",
    name: "回声",
    en: "Echo",
    breed: "暹罗猫",
    pattern: "siamese",
    trait: "耳朵极灵，话多，喜欢重复你说的最后一个词",
    ability: "听音辨词 · 听句抓词 · 听句理解 · 听问答",
    region: "回声山谷",
    color: "#1F9BA6",
    soft: "#E2F5F6",
    kind: "listen",
    unlock: { type: "level", value: 2, text: "通过木兰第 1 关，或达到 2 级" },
    stages: [
      { name: "风里的单词", level: 1, size: 6 },
      { name: "听句抓词", level: 2, size: 6 },
      { name: "句子的回声", level: 2, size: 6 },
      { name: "山谷深处", level: 3, size: 7 },
    ],
    praise: ["耳朵很准，回声点头了。", "听对了，这句的重音你抓住了。", "很好，再快一点也难不倒你。"],
    comfort: ["差一点就听到了，和回声再听一次吧。", "这段声音有点快，慢速再听一遍。", "别急，听力是练出来的。"],
  },
  {
    id: "pepper",
    name: "胡椒",
    en: "Pepper",
    breed: "挪威森林猫",
    pattern: "forest",
    trait: "爱冒险，总把句子拆开藏在树洞里让你拼回去",
    ability: "句子排序 · 对话补全 · 语境选词 · 阅读",
    region: "语境林地",
    color: "#7257C8",
    soft: "#EEEAFB",
    kind: "mixed",
    unlock: { type: "level", value: 3, text: "通过回声山谷第 1 关，或达到 3 级" },
    stages: [
      { name: "林间短句", level: 1, size: 6 },
      { name: "对话小径", level: 2, size: 6 },
      { name: "树洞谜题", level: 3, size: 7 },
    ],
    praise: ["顺序对了，胡椒把树洞打开了。", "语感不错，这句读起来很自然。", "你已经能看懂上下文了。"],
    comfort: ["再看看前后两句，线索就在里面。", "顺序差一点，先看正确答案。", "这道有点绕，胡椒也想了三秒。"],
  },
  {
    id: "mochi",
    name: "麻薯",
    en: "Mochi",
    breed: "布偶猫",
    pattern: "ragdoll",
    trait: "慢性子，负责把你答错的词抱回小屋，按天提醒你",
    ability: "错题整理 · 间隔复习 · 掌握度追踪",
    region: "复习小屋",
    color: "#D96189",
    soft: "#FCE8EF",
    kind: "review",
    unlock: { type: "mistakes", value: 2, text: "收集 2 个复习内容后解锁" },
    stages: [{ name: "今日复习", level: 1, size: 6 }],
    praise: ["这个词你已经稳了，麻薯把它放到「已掌握」了。", "第二次就答对，进步明显。", "复习最难坚持，你做到了。"],
    comfort: ["再来一次就好，麻薯不着急。", "这个词还需要练，留在清单里。", "错第二次也正常，记住拼法再走。"],
  },
  {
    id: "luna",
    name: "夜莺",
    en: "Luna",
    breed: "孟买猫",
    pattern: "bombay",
    trait: "神出鬼没，只在你三项能力都练过之后出现",
    ability: "混合大挑战：听力为主 + 识词 + 语境",
    region: "星夜塔",
    color: "#3B4EA0",
    soft: "#E6E9F7",
    kind: "boss",
    unlock: { type: "level", value: 5, text: "达到 5 级，或前面区域各通两关" },
    stages: [{ name: "星夜试炼", level: 3, size: 8 }],
    praise: ["漂亮，塔顶的灯又亮了一盏。", "三种能力都用上了，很扎实。", "夜莺记住你了。"],
    comfort: ["塔里风大，再试一次。", "这题混合了几个点，慢慢拆开看。", "走到这里已经不容易了。"],
  },
];

const CAT_BY_ID = Object.fromEntries(CATS.map((c) => [c.id, c]));

/* ---------------------------------------------------------------------
   3. 工具函数与语音
   --------------------------------------------------------------------- */

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sample = (arr, n) => shuffle(arr).slice(0, n);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const uid = () => Math.random().toString(36).slice(2, 9);

// 等级：升到下一级所需经验随等级缓慢增长
const xpForLevel = (lv) => 50 + (lv - 1) * 20;

function levelFromXp(totalXp) {
  let lv = 1;
  let rest = totalXp;
  while (rest >= xpForLevel(lv)) {
    rest -= xpForLevel(lv);
    lv += 1;
  }
  return { level: lv, inLevel: rest, need: xpForLevel(lv) };
}

const AFFECTION_TITLES = ["初次见面", "点头之交", "愿意贴贴", "并肩冒险", "形影不离", "最佳搭档"];
const affectionLevel = (points) => Math.min(5, Math.floor(points / 25));

// Web Speech API 封装
function useSpeech() {
  const [supported, setSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(ok);
    if (!ok) return;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      voiceRef.current =
        voices.find((v) => /en[-_]US/i.test(v.lang)) ||
        voices.find((v) => /^en/i.test(v.lang)) ||
        null;
    };
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text, rate = 0.9) => {
      if (!supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const u = new window.SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = rate;
        u.pitch = 1;
        if (voiceRef.current) u.voice = voiceRef.current;
        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch (e) {
        setSpeaking(false);
      }
    },
    [supported]
  );

  return { supported, speaking, speak };
}

/* ---------------------------------------------------------------------
   4. 猫咪头像（内联 SVG，按品种区分）
   --------------------------------------------------------------------- */

/*
  表情参照角色设定表：grumpy（默认）/ curious / playful / angry / sad / skeptical / sleeping / happy
  idle 会自动映射为主角的 grumpy，其他猫保持中性表情。
*/
const MOOD_ALIAS = { idle: "neutral", happy: "playful" };

function CatAvatar({ cat, mood = "idle", size = 96, dim = false }) {
  const silver = cat.pattern === "silvertabby";
  let m = MOOD_ALIAS[mood] || mood;
  if (m === "neutral" && silver) m = "grumpy";

  const fur = dim ? "#C9CCD4" : cat.fur || cat.color;
  const mark = dim ? "#E2E4EA" : cat.fur2 || cat.soft;
  const inner = dim ? "#E6E7EC" : silver ? "#E9C3C6" : cat.soft;
  const muzzle = silver ? "#F4F6F8" : null;
  const iris = dim ? null : cat.eye || null;
  const lidFill = fur;

  const openEye = (cx, squash = 1) =>
    iris ? (
      <g key={`e${cx}`}>
        <ellipse cx={cx} cy="47" rx="7.4" ry={7.8 * squash} fill="#7A5A1E" opacity="0.35" />
        <ellipse cx={cx} cy="47" rx="6.8" ry={7.2 * squash} fill={iris} />
        <ellipse cx={cx} cy="47" rx="2.5" ry={6.4 * squash} fill="#241F33" />
        <circle cx={cx + 2.4} cy={47 - 3 * squash} r="1.7" fill="#fff" opacity="0.9" />
      </g>
    ) : (
      <g key={`e${cx}`}>
        <ellipse cx={cx} cy="47" rx="5" ry={6 * squash} fill="#2A2540" />
        <circle cx={cx + 2} cy={47 - 2 * squash} r="1.6" fill="#fff" />
      </g>
    );

  const lid = (cx, drop) => (
    <path
      key={`l${cx}`}
      d={`M${cx - 8} ${47 - 8} h16 v${drop} q-8 3 -16 0 Z`}
      fill={lidFill}
    />
  );

  const arcEye = (cx, down) => (
    <path
      key={`a${cx}`}
      d={down ? `M${cx - 6} 45 q6 7 12 0` : `M${cx - 6} 49 q6 -8 12 0`}
      stroke="#2A2540"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  );

  const brow = (cx, dir) => (
    <path
      key={`b${cx}`}
      d={dir > 0 ? `M${cx - 8} 34 l14 5` : `M${cx + 8} 34 l-14 5`}
      stroke={mark}
      strokeWidth="3"
      strokeLinecap="round"
    />
  );

  let eyes;
  if (m === "playful") eyes = [arcEye(40, false), arcEye(60, false)];
  else if (m === "sleeping") eyes = [arcEye(40, true), arcEye(60, true)];
  else if (m === "angry") eyes = [openEye(40, 0.7), openEye(60, 0.7), lid(40, 5), lid(60, 5), brow(40, 1), brow(60, -1)];
  else if (m === "grumpy") eyes = [openEye(40, 0.85), openEye(60, 0.85), lid(40, 3.5), lid(60, 3.5)];
  else if (m === "skeptical") eyes = [openEye(40, 0.55), openEye(60, 1), lid(40, 6), brow(60, -1)];
  else if (m === "sad") eyes = [openEye(40, 0.9), openEye(60, 0.9), brow(40, -1), brow(60, 1)];
  else if (m === "curious") eyes = [openEye(40, 1.15), openEye(60, 1.15)];
  else eyes = [openEye(40), openEye(60)];

  const mouths = {
    playful: (
      <g>
        <path d="M42 66 q8 10 16 0 z" fill="#8A4A57" />
        <path d="M46 70 q4 5 8 0 z" fill="#EE8FA3" />
      </g>
    ),
    curious: <circle cx="50" cy="69" r="3" fill="#8A4A57" />,
    sleeping: <path d="M46 68 q4 3 8 0" stroke="#8A4A57" strokeWidth="2.2" fill="none" strokeLinecap="round" />,
    sad: <path d="M43 71 q7 -6 14 0" stroke="#8A4A57" strokeWidth="2.4" fill="none" strokeLinecap="round" />,
    angry: <path d="M43 70 h14" stroke="#8A4A57" strokeWidth="2.6" strokeLinecap="round" />,
    skeptical: <path d="M44 70 q7 -2 13 -4" stroke="#8A4A57" strokeWidth="2.4" fill="none" strokeLinecap="round" />,
    grumpy: (
      <g stroke="#8A4A57" strokeWidth="2.3" fill="none" strokeLinecap="round">
        <path d="M44 66 q3 4 6 0" />
        <path d="M50 66 q3 4 6 0" />
      </g>
    ),
  };
  const mouth = mouths[m] || (
    <g stroke="#8A4A57" strokeWidth="2.3" fill="none" strokeLinecap="round">
      <path d="M44 66 q3 4 6 0" />
      <path d="M50 66 q3 4 6 0" />
    </g>
  );

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${cat.name}（${cat.breed}）`}>
      {/* 尾巴 */}
      <path d="M78 76 q17 -5 12 -21" stroke={fur} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.92" />
      {silver && <path d="M84 66 l5 2 M87 58 l5 1" stroke={mark} strokeWidth="2.6" strokeLinecap="round" />}

      {/* 尖耳 */}
      <path d={silver ? "M24 35 L18 7 L46 24 Z" : "M25 34 L22 13 L43 25 Z"} fill={fur} />
      <path d={silver ? "M76 35 L82 7 L54 24 Z" : "M75 34 L78 13 L57 25 Z"} fill={fur} />
      <path d={silver ? "M28 31 L25 15 L40 25 Z" : "M29 31 L28 19 L39 26 Z"} fill={inner} />
      <path d={silver ? "M72 31 L75 15 L60 25 Z" : "M71 31 L72 19 L61 26 Z"} fill={inner} />
      {cat.pattern === "forest" && (
        <g stroke={mark} strokeWidth="2" strokeLinecap="round">
          <path d="M24 16 l-5 -6" />
          <path d="M76 16 l5 -6" />
        </g>
      )}

      {/* 头 */}
      <ellipse cx="50" cy="52" rx="32" ry="29" fill={fur} />

      {/* 花纹 */}
      {silver && (
        <g fill="none" stroke={mark} strokeLinecap="round">
          {/* 额头 M 形虎斑 */}
          <path d="M40 30 q3 8 2 14" strokeWidth="3.4" />
          <path d="M50 27 q0 9 0 14" strokeWidth="3.8" />
          <path d="M60 30 q-3 8 -2 14" strokeWidth="3.4" />
          <path d="M33 34 q4 6 4 10" strokeWidth="2.6" opacity="0.8" />
          <path d="M67 34 q-4 6 -4 10" strokeWidth="2.6" opacity="0.8" />
          {/* 脸颊斑纹 */}
          <path d="M20 50 q7 2 10 5" strokeWidth="2.6" opacity="0.75" />
          <path d="M22 59 q7 0 10 2" strokeWidth="2.4" opacity="0.6" />
          <path d="M80 50 q-7 2 -10 5" strokeWidth="2.6" opacity="0.75" />
          <path d="M78 59 q-7 0 -10 2" strokeWidth="2.4" opacity="0.6" />
        </g>
      )}
      {cat.pattern === "siamese" && <ellipse cx="50" cy="60" rx="20" ry="16" fill="#F3E7DC" opacity="0.92" />}
      {cat.pattern === "ragdoll" && (
        <g fill={mark} opacity="0.9">
          <ellipse cx="24" cy="58" rx="8" ry="10" />
          <ellipse cx="76" cy="58" rx="8" ry="10" />
        </g>
      )}
      {cat.pattern === "bombay" && (
        <g fill="#F5D86B">
          <path d="M18 24 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" />
          <path d="M84 40 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 Z" />
        </g>
      )}
      {cat.pattern === "forest" && (
        <g stroke={mark} strokeWidth="2.6" strokeLinecap="round" opacity="0.8">
          <path d="M22 48 l7 2" />
          <path d="M78 48 l-7 2" />
        </g>
      )}

      {/* 白色口鼻区 */}
      {muzzle && <ellipse cx="50" cy="64" rx="17" ry="12" fill={muzzle} opacity="0.95" />}

      {eyes}

      {/* 鼻子 */}
      <path d="M46.5 58.5 L53.5 58.5 L50 62.5 Z" fill={silver ? "#D98C99" : "#8A4A57"} />
      {mouth}

      {/* 胡须点 + 胡须 */}
      {silver && (
        <g fill="#8A93A0" opacity="0.7">
          <circle cx="40" cy="63" r="0.9" />
          <circle cx="37" cy="66" r="0.9" />
          <circle cx="60" cy="63" r="0.9" />
          <circle cx="63" cy="66" r="0.9" />
        </g>
      )}
      <g stroke={silver ? "#F2F4F7" : cat.pattern === "siamese" || cat.pattern === "bombay" ? "#F1EAE2" : "#7A5A3A"} strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        <path d="M16 55 l16 3" />
        <path d="M16 63 l16 -1" />
        <path d="M84 55 l-16 3" />
        <path d="M84 63 l-16 -1" />
      </g>

      {m === "playful" && (
        <g fill="#F08FA8" opacity="0.6">
          <ellipse cx="28" cy="60" rx="5" ry="3.4" />
          <ellipse cx="72" cy="60" rx="5" ry="3.4" />
        </g>
      )}
      {m === "sleeping" && (
        <g fill="#94A3B8" fontSize="11" fontWeight="700">
          <text x="76" y="26">z</text>
          <text x="84" y="18">z</text>
        </g>
      )}
    </svg>
  );
}

/* ---------------------------------------------------------------------
   5. 基础 UI 组件
   --------------------------------------------------------------------- */

function Btn({ children, onClick, tone = "solid", color = "#2A2540", disabled, className = "", ...rest }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-transform duration-150 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed";
  const style =
    tone === "solid"
      ? { backgroundColor: color, color: "#fff", boxShadow: `0 4px 0 0 ${color}55` }
      : tone === "ghost"
      ? { backgroundColor: "transparent", color: color, border: `2px solid ${color}33` }
      : { backgroundColor: "#fff", color: color, border: `2px solid ${color}` };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`${base} ${disabled ? "" : "hover:-translate-y-0.5 active:translate-y-0"} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

function Bar({ value, max, color, height = "h-2.5" }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className={`w-full ${height} rounded-full bg-slate-200 overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function Paw({ filled, color = "#E08A3C", size = 18 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <g fill={filled ? color : "#D8D8E0"}>
        <ellipse cx="12" cy="15.5" rx="6" ry="5" />
        <ellipse cx="5.5" cy="9" rx="2.6" ry="3.2" />
        <ellipse cx="10" cy="6" rx="2.6" ry="3.4" />
        <ellipse cx="14.8" cy="6" rx="2.6" ry="3.4" />
        <ellipse cx="19" cy="9.4" rx="2.6" ry="3.2" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------
   6. 出题引擎
   题目统一结构：
   { qid, mode: 'choice' | 'spell' | 'order', badge, prompt, promptSub,
     passage, audio, hideText, options, answer, tokens, answerTokens,
     explain, item }
   item = 加入复习清单时保存的内容
   --------------------------------------------------------------------- */

const tok = (sentence) => sentence.trim().split(/\s+/);
const toTokens = (words) => words.map((t) => ({ tid: uid(), text: t }));

const wordItem = (w) => ({ type: "word", id: w.id, en: w.en, zh: w.zh });
const sentItem = (s) => ({ type: "sentence", id: s.id, en: s.en, zh: s.zh });

// 生成形近的错误拼写，用于「选出正确拼写」这类识别题
const VOWELS = "aeiou";
function misspell(word) {
  const out = new Set();
  for (let i = 1; i < word.length - 1; i++) {
    if (word[i] !== word[i + 1]) out.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  }
  for (let i = 0; i < word.length; i++) {
    if (VOWELS.includes(word[i])) {
      const alt = VOWELS.replace(word[i], "");
      out.add(word.slice(0, i) + alt[Math.floor(Math.random() * alt.length)] + word.slice(i + 1));
    }
  }
  for (let i = 1; i < word.length; i++) out.add(word.slice(0, i) + word.slice(i + 1));
  for (let i = 1; i < word.length; i++) out.add(word.slice(0, i) + word[i] + word.slice(i));
  out.delete(word);
  return shuffle([...out]).slice(0, 3);
}

/* ---- 识词类 ---- */

function qEn2Zh(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.zh);
  return {
    qid: uid(), mode: "choice", badge: "看词选义",
    prompt: w.en, promptSub: "选出正确的中文意思",
    options: shuffle([w.zh, ...wrong]), answer: w.zh, audio: w.en,
    explain: `${w.en} = ${w.zh}（Unit ${w.unit}）`,
    item: wordItem(w),
  };
}

function qZh2En(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "看义选词",
    prompt: w.zh, promptSub: "选出对应的英文单词",
    options: shuffle([w.en, ...wrong]), answer: w.en,
    explain: `${w.zh} = ${w.en}`,
    item: wordItem(w),
  };
}

// 词形辨认：四个形近词里选出正确拼写（替代大部分手动拼写）
function qSpellPick(w) {
  return {
    qid: uid(), mode: "choice", badge: "词形辨认",
    prompt: w.zh, promptSub: "哪一个拼写是正确的？可以先听一遍发音",
    options: shuffle([w.en, ...misspell(w.en)]), answer: w.en, audio: w.en,
    explain: `正确拼写：${w.en}（${w.zh}）`,
    item: wordItem(w),
  };
}

// 词义分类：哪个词属于某一类
function qCategory(w, pool) {
  const others = sample(pool.filter((x) => x.group !== w.group), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "词义分类",
    prompt: `哪个词属于「${w.group}」？`, promptSub: "看清四个选项的意思再选",
    options: shuffle([w.en, ...others]), answer: w.en,
    explain: `${w.en} = ${w.zh}，属于${w.group}。`,
    item: wordItem(w),
  };
}

function qWordContext(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "语境选词",
    prompt: w.sent.replace("____", "______"), promptSub: "选出填入空格最合适的单词",
    options: shuffle([w.en, ...wrong]), answer: w.en,
    explain: `${w.sent.replace("____", w.en)}（${w.en} = ${w.zh}）`,
    item: wordItem(w),
  };
}

// 看图选词（emoji 代替插画，演示用，可换成真实图片资源）
function qPicture(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "看图选词",
    picture: w.emoji, prompt: "", promptSub: "这个图表示哪个单词？",
    options: shuffle([w.en, ...wrong]), answer: w.en, audio: w.en,
    explain: `${w.emoji} ${w.en} = ${w.zh}`,
    item: wordItem(w),
  };
}

// 找不同类：三个同类词 + 一个异类词
function qOddOne(subs, all) {
  const groups = [...new Set(subs.map((w) => w.group))];
  const g = pick(groups);
  const same = sample(all.filter((w) => w.group === g), 3);
  const oddPool = all.filter((w) => w.group !== g);
  if (same.length < 3 || !oddPool.length) return null;
  const odd = pick(oddPool);
  return {
    qid: uid(), mode: "choice", badge: "找不同类",
    prompt: "哪个词和其他三个不是一类？", promptSub: "先想想每个词的意思",
    options: shuffle([odd.en, ...same.map((w) => w.en)]), answer: odd.en,
    explain: `${odd.en}（${odd.zh}）属于${odd.group}，其余三个都属于${g}。`,
    item: wordItem(odd),
  };
}

// 词组搭配
function qPhrase(p, pool) {
  const wrong = sample(pool.filter((x) => x.id !== p.id), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "词组搭配",
    prompt: p.zh, promptSub: "选出对应的英文词组",
    options: shuffle([p.en, ...wrong]), answer: p.en, audio: p.en,
    explain: `${p.zh} = ${p.en}`,
    item: { type: "note", id: p.id, en: p.en, zh: p.zh },
  };
}

// 保留少量手动拼写，只出现在单词区最后一关
function qSpell(w) {
  return {
    qid: uid(), mode: "spell", badge: "拼写挑战",
    prompt: w.zh, promptSub: "按顺序点击字母，拼出这个单词",
    answer: w.en, letters: shuffle(w.en.split("")), audio: w.en,
    explain: `正确拼写：${w.en}`,
    item: wordItem(w),
  };
}

/* ---- 听力类 ---- */

// 听单词，选英文
function qListenWord(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "听音辨词", hideText: true,
    prompt: "", promptSub: "听发音，选出你听到的单词",
    audio: w.en, options: shuffle([w.en, ...wrong]), answer: w.en,
    explain: `听到的是 ${w.en}（${w.zh}）`,
    item: wordItem(w),
  };
}

// 听单词，选中文
function qListenWordZh(w, pool) {
  const wrong = sample(pool.filter((x) => x.id !== w.id), 3).map((x) => x.zh);
  return {
    qid: uid(), mode: "choice", badge: "听音选义", hideText: true,
    prompt: "", promptSub: "听发音，选出它的中文意思",
    audio: w.en, options: shuffle([w.zh, ...wrong]), answer: w.zh,
    explain: `听到的是 ${w.en} = ${w.zh}`,
    item: wordItem(w),
  };
}

// 听形近词：四个形近词中选出听到的那个，练听辨
function qListenMinimal(w, pool) {
  const opts = new Set([w.en]);
  misspell(w.en).forEach((m) => opts.size < 4 && opts.add(m));
  sample(pool.filter((x) => x.id !== w.id), 4).forEach((x) => opts.size < 4 && opts.add(x.en));
  return {
    qid: uid(), mode: "choice", badge: "听音辨形", hideText: true,
    prompt: "", promptSub: "四个词很像，听清楚再选",
    audio: w.en, options: shuffle([...opts]), answer: w.en,
    explain: `听到的是 ${w.en}（${w.zh}）`,
    item: wordItem(w),
  };
}

// 听单词，选图
function qListenPicture(w, pool) {
  const seen = new Set([w.emoji]);
  const wrong = [];
  shuffle(pool.filter((x) => x.emoji && x.id !== w.id)).forEach((x) => {
    if (wrong.length < 3 && !seen.has(x.emoji)) {
      seen.add(x.emoji);
      wrong.push(x.emoji);
    }
  });
  return {
    qid: uid(), mode: "choice", badge: "听音选图", hideText: true, pictureOptions: true,
    prompt: "", promptSub: "听发音，选出对应的图",
    audio: w.en, options: shuffle([w.emoji, ...wrong]), answer: w.emoji,
    explain: `${w.emoji} ${w.en} = ${w.zh}`,
    item: wordItem(w),
  };
}

// 听句子，选出被挖掉的词
function qListenGap(s, wordPool) {
  const gap = s.gap;
  const blanked = s.en.replace(new RegExp(`\\b${gap}\\b`), "______");
  const wrong = sample(wordPool.filter((x) => x.en !== gap), 3).map((x) => x.en);
  return {
    qid: uid(), mode: "choice", badge: "听句抓词", hideText: true,
    prompt: "", promptSub: "听句子，选出空格处听到的词",
    audio: s.en, blanked,
    options: shuffle([gap, ...wrong]), answer: gap,
    explain: `${s.en} —— ${s.zh}`,
    item: sentItem(s),
  };
}

// 听句子，选中文意思
function qListenMeaning(s, pool) {
  const wrong = sample(pool.filter((x) => x.id !== s.id), 3).map((x) => x.zh);
  return {
    qid: uid(), mode: "choice", badge: "句子听力", hideText: true,
    prompt: "", promptSub: "听句子，选出它的意思",
    audio: s.en, options: shuffle([s.zh, ...wrong]), answer: s.zh,
    explain: `${s.en} —— ${s.zh}`,
    item: sentItem(s),
  };
}

// 听问题，选回答
function qListenQA(p) {
  return {
    qid: uid(), mode: "choice", badge: "听问选答", hideText: true,
    prompt: "", promptSub: "听问题，选出最合适的回答",
    audio: p.q, options: shuffle([p.answer, ...p.wrong]), answer: p.answer,
    explain: `问题：${p.q} —— 回答：${p.answer}`,
    item: { type: "note", id: p.id, en: `${p.q} → ${p.answer}`, zh: "听问答" },
  };
}

// 听后排序
function qListenOrder(s) {
  return {
    qid: uid(), mode: "order", badge: "听后排序", hideText: true,
    prompt: "", promptSub: "先听句子，再按听到的顺序点击词块",
    audio: s.en, tokens: toTokens(shuffle(tok(s.en))), answer: s.en,
    explain: `${s.en} —— ${s.zh}`,
    item: sentItem(s),
  };
}

/* ---- 综合类 ---- */

function qOrder(s) {
  return {
    qid: uid(), mode: "order", badge: "句子排序",
    prompt: s.zh, promptSub: "点击词块，拼出对应的英文句子",
    tokens: toTokens(shuffle(tok(s.en))), answer: s.en, audio: s.en,
    explain: `${s.en}`,
    item: sentItem(s),
  };
}

function qDialogue(d) {
  return {
    qid: uid(), mode: "choice", badge: "对话补全",
    prompt: "", promptSub: "选出空格处最自然的一句话",
    dialogue: d.lines,
    options: shuffle(d.options), answer: d.answer,
    explain: d.explain,
    item: { type: "note", id: d.id, en: d.answer, zh: d.explain },
  };
}

function qCloze(c) {
  return {
    qid: uid(), mode: "choice", badge: "语境选词",
    prompt: c.text.replace("____", "______"), promptSub: "选出填入空格最合适的词",
    options: shuffle(c.options), answer: c.answer, audio: c.text.replace("____", c.answer),
    explain: `${c.text.replace("____", c.answer)} —— ${c.zh}`,
    item: { type: "note", id: c.id, en: c.text.replace("____", c.answer), zh: c.zh },
  };
}

function qReading(r) {
  return r.questions.map((q, i) => ({
    qid: uid(), mode: "choice", badge: "阅读理解",
    passage: { title: r.title, text: r.text },
    prompt: q.q, promptSub: "读短文，选出正确答案",
    options: shuffle(q.options), answer: q.answer,
    explain: q.explain,
    item: { type: "note", id: `${r.id}-${i}`, en: q.q, zh: q.explain },
  }));
}

/* ---- 关卡组装：unit = 0 表示全部单元 ---- */

const byLevel = (arr, lv) => {
  const hit = arr.filter((x) => x.level <= lv);
  return hit.length >= 4 ? hit : arr;
};

// 出题对象取自所选单元；干扰项始终从全量词库取，保证选项充足
function subjects(arr, unit, lv) {
  if (unit) {
    const hit = arr.filter((x) => x.unit === unit);
    if (hit.length) return hit;
  }
  return byLevel(arr, lv);
}

const hasEmoji = (arr) => arr.filter((w) => w.emoji);

function buildWordStage(stage, unit) {
  const subs = subjects(BANK.words, unit, stage.level);
  const pics = hasEmoji(subs);
  const phr = unit ? BANK.phrases.filter((p) => p.unit === unit) : BANK.phrases;
  const phrasePool = phr.length >= 4 ? phr : BANK.phrases;
  const picks = sample(subs, Math.min(stage.size, subs.length));
  const out = [];
  for (let i = 0; i < stage.size; i++) {
    const w = picks[i % picks.length];
    if (stage.level === 1) {
      const r = i % 3;
      if (r === 0) out.push(qEn2Zh(w, BANK.words));
      else if (r === 1) out.push(qZh2En(w, BANK.words));
      else out.push(pics.length ? qPicture(pick(pics), BANK.words) : qEn2Zh(w, BANK.words));
    } else if (stage.level === 2) {
      const r = i % 4;
      if (r === 0) out.push(qSpellPick(w));
      else if (r === 1) out.push(qZh2En(w, BANK.words));
      else if (r === 2) out.push(qCategory(w, BANK.words));
      else out.push(qOddOne(subs, BANK.words) || qEn2Zh(w, BANK.words));
    } else {
      const r = i % 4;
      if (r === 0) out.push(qWordContext(w, BANK.words));
      else if (r === 1) out.push(qPhrase(pick(phrasePool), BANK.phrases));
      else if (r === 2) out.push(qOddOne(subs, BANK.words) || qSpellPick(w));
      else out.push(pics.length ? qPicture(pick(pics), BANK.words) : qEn2Zh(w, BANK.words));
    }
  }
  // 最后一关保留一道手动拼写，挑短词
  if (stage.level === 3) {
    const shortWord = pick(subs.filter((w) => w.en.length <= 7)) || subs[0];
    out[out.length - 1] = qSpell(shortWord);
  }
  return out;
}

function buildListenStage(stage, unit) {
  const wSubs = subjects(BANK.words, unit, stage.level);
  const wPics = hasEmoji(wSubs);
  const sSubs = subjects(BANK.sentences, unit, stage.level);
  const qaSubs = unit ? (BANK.qa.filter((q) => q.unit === unit).length ? BANK.qa.filter((q) => q.unit === unit) : BANK.qa) : BANK.qa;
  const out = [];
  for (let i = 0; i < stage.size; i++) {
    if (stage.name === "风里的单词") {
      const r = i % 4;
      if (r === 0) out.push(qListenWord(pick(wSubs), BANK.words));
      else if (r === 1) out.push(qListenWordZh(pick(wSubs), BANK.words));
      else if (r === 2) out.push(wPics.length >= 4 ? qListenPicture(pick(wPics), BANK.words) : qListenWord(pick(wSubs), BANK.words));
      else out.push(qListenMinimal(pick(wSubs), BANK.words));
    } else if (stage.name === "听句抓词") {
      out.push(i % 3 === 2 ? qListenWord(pick(wSubs), BANK.words) : qListenGap(pick(sSubs), BANK.words));
    } else if (stage.name === "句子的回声") {
      out.push(i % 2 === 0 ? qListenMeaning(pick(sSubs), BANK.sentences) : qListenQA(pick(qaSubs)));
    } else {
      const r = i % 4;
      if (r === 0) out.push(qListenOrder(pick(sSubs)));
      else if (r === 1) out.push(qListenQA(pick(qaSubs)));
      else if (r === 2) out.push(qListenGap(pick(sSubs), BANK.words));
      else out.push(qListenMeaning(pick(sSubs), BANK.sentences));
    }
  }
  return out;
}

function buildMixedStage(stage, unit) {
  const sSubs = subjects(BANK.sentences, unit, stage.level);
  const cSubs = subjects(BANK.cloze, unit, stage.level);
  const dSubs = subjects(BANK.dialogues, unit, stage.level);
  const rSubs = subjects(BANK.readings, unit, stage.level);
  const out = [];
  if (stage.level === 1) {
    sample(sSubs, 3).forEach((s) => out.push(qOrder(s)));
    sample(cSubs, 2).forEach((c) => out.push(qCloze(c)));
    out.push(qDialogue(pick(dSubs)));
  } else if (stage.level === 2) {
    sample(dSubs, 2).forEach((d) => out.push(qDialogue(d)));
    sample(cSubs, 2).forEach((c) => out.push(qCloze(c)));
    sample(sSubs, 2).forEach((s) => out.push(qOrder(s)));
  } else {
    qReading(pick(rSubs)).forEach((q) => out.push(q));
    sample(cSubs, 2).forEach((c) => out.push(qCloze(c)));
    sample(sSubs, 2).forEach((s) => out.push(qOrder(s)));
    out.push(qDialogue(pick(dSubs)));
  }
  while (out.length < stage.size) out.push(qCloze(pick(BANK.cloze)));
  return shuffle(out).slice(0, stage.size);
}

// 星夜塔：一半听力，一半识词与语境
function buildBossStage(stage, unit) {
  const wSubs = subjects(BANK.words, unit, 3);
  const sSubs = subjects(BANK.sentences, unit, 3);
  const qaSubs = unit ? (BANK.qa.filter((q) => q.unit === unit).length ? BANK.qa.filter((q) => q.unit === unit) : BANK.qa) : BANK.qa;
  const wPics = hasEmoji(wSubs);
  const out = [
    qListenWordZh(pick(wSubs), BANK.words),
    wPics.length >= 4 ? qListenPicture(pick(wPics), BANK.words) : qListenMinimal(pick(wSubs), BANK.words),
    qListenGap(pick(sSubs), BANK.words),
    qListenQA(pick(qaSubs)),
    qListenOrder(pick(sSubs)),
    qSpellPick(pick(wSubs)),
    qOddOne(wSubs, BANK.words) || qWordContext(pick(wSubs), BANK.words),
    qWordContext(pick(wSubs), BANK.words),
    qCloze(pick(BANK.cloze)),
    qDialogue(pick(BANK.dialogues)),
  ];
  return shuffle(out).slice(0, stage.size);
}

function buildStage(cat, stageIndex, unit = 0) {
  const stage = cat.stages[stageIndex];
  if (cat.kind === "word") return buildWordStage(stage, unit);
  if (cat.kind === "listen") return buildListenStage(stage, unit);
  if (cat.kind === "mixed") return buildMixedStage(stage, unit);
  if (cat.kind === "boss") return buildBossStage(stage, unit);
  return [];
}

// 复习小屋：单词以识别和听力为主，不再强制手写拼写
function buildReviewStage(items, size = 6) {
  const due = [...items].sort((a, b) => a.streak - b.streak || b.wrong - a.wrong).slice(0, size);
  return due.map((it) => {
    if (it.type === "word") {
      const w = BANK.words.find((x) => x.id === it.id) || { ...it, unit: 0, group: "复习", level: 1, sent: "I know the word ____." };
      const r = Math.random();
      if (r < 0.2 && w.emoji) return { ...qPicture(w, BANK.words), reviewKey: it.key };
      if (r < 0.45) return { ...qListenWordZh(w, BANK.words), reviewKey: it.key };
      if (r < 0.7) return { ...qSpellPick(w), reviewKey: it.key };
      if (r < 0.85) return { ...qZh2En(w, BANK.words), reviewKey: it.key };
      return { ...qEn2Zh(w, BANK.words), reviewKey: it.key };
    }
    if (it.type === "sentence") {
      const s = BANK.sentences.find((x) => x.id === it.id) || { ...it, level: 1, gap: null };
      if (s.gap && Math.random() < 0.4) return { ...qListenGap(s, BANK.words), reviewKey: it.key };
      return Math.random() < 0.5
        ? { ...qOrder(s), reviewKey: it.key }
        : { ...qListenMeaning(s, BANK.sentences), reviewKey: it.key };
    }
    return { ...(it.snapshot || qEn2Zh(BANK.words[0], BANK.words)), qid: uid(), reviewKey: it.key };
  });
}

/* ---------------------------------------------------------------------
   6.5 教材选择页（首次进入）
   --------------------------------------------------------------------- */

function CurriculumScreen({ current, onPick }) {
  const mulan = CAT_BY_ID.mulan;
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-3xl p-6" style={{ background: "linear-gradient(135deg,#E9ECF1 0%,#FAFBFC 65%)" }}>
        <div className="flex flex-wrap items-center gap-5">
          <CatAvatar cat={mulan} size={104} mood="curious" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">木兰英语冒险</h1>
            <p className="mt-1.5 text-sm text-slate-600">
              先告诉木兰你在用哪套教材，她会按对应的词表和句型出题。之后随时可以在地图上换。
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CURRICULA.map((c) => {
          const on = c.id === current;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              className="rounded-3xl border-2 bg-white p-5 text-left transition-transform hover:-translate-y-0.5"
              style={{
                borderColor: on ? mulan.color : "#E2E5EE",
                boxShadow: on ? `0 12px 30px -20px ${mulan.color}` : "0 10px 30px -20px rgba(40,36,70,.45)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold text-slate-800">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.sub}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{c.tag}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.note}</p>
              <p className="mt-3 text-xs text-slate-400">
                {c.bank.units.map((u) => u.label || `Unit ${u.id}`).join(" · ")} · 共 {c.bank.words.length} 词
              </p>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs leading-relaxed text-slate-400">
        各版本题库均按公开课标与教材目录整理的示例内容，例句、对话与短文为自编演示题，不是教材原文，可整体替换。
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------
   7. 地图页（首页）
   --------------------------------------------------------------------- */

function StatHeader({ level, inLevel, need, stars, streak, totalMastered }) {
  return (
    <div className="rounded-3xl bg-white p-4 sm:p-5" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl text-white"
            style={{ backgroundColor: "#2A2540" }}
          >
            <span className="text-base font-extrabold leading-none">{level}</span>
            <span className="text-xs leading-none opacity-70">LV</span>
          </div>
          <div className="w-32">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>经验</span>
              <span>{inLevel}/{need}</span>
            </div>
            <Bar value={inLevel} max={need} color="#2A2540" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Paw filled color="#E08A3C" size={20} />
          <span className="text-lg font-extrabold text-slate-800">{stars}</span>
          <span className="text-xs text-slate-500">猫爪印</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <span className="text-lg font-extrabold text-slate-800">{streak}</span>
          <span className="text-xs text-slate-500">天连续学习</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">📗</span>
          <span className="text-lg font-extrabold text-slate-800">{totalMastered}</span>
          <span className="text-xs text-slate-500">个词已掌握</span>
        </div>
      </div>
    </div>
  );
}

function DailyTasks({ daily }) {
  const tasks = [
    { label: "完成 2 个关卡", now: Math.min(daily.stages, 2), goal: 2 },
    { label: "答对 12 道题", now: Math.min(daily.correct, 12), goal: 12 },
    { label: "复习 3 个内容", now: Math.min(daily.reviewed, 3), goal: 3 },
  ];
  return (
    <div className="rounded-3xl bg-white p-5" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
      <h3 className="mb-3 text-sm font-bold text-slate-800">今日目标</h3>
      <div className="space-y-3">
        {tasks.map((t) => {
          const done = t.now >= t.goal;
          return (
            <div key={t.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={done ? "font-semibold text-emerald-600" : "text-slate-600"}>
                  {done ? "✓ " : ""}
                  {t.label}
                </span>
                <span className="text-slate-400">{t.now}/{t.goal}</span>
              </div>
              <Bar value={t.now} max={t.goal} color={done ? "#2E9E6B" : "#9C93C8"} height="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegionCard({ cat, unlocked, progress, affection, onEnter, recommended }) {
  const [open, setOpen] = useState(false);
  const aff = affectionLevel(affection);
  const cleared = progress.cleared || 0;
  return (
    <div className="relative pl-8">
      <span
        className="absolute left-2 top-10 h-5 w-5 rounded-full border-4 border-white"
        style={{ backgroundColor: unlocked ? cat.color : "#CBD0DC" }}
      />
      <div
        className="rounded-3xl bg-white p-5 transition-shadow"
        style={{
          boxShadow: recommended
            ? `0 0 0 2px ${cat.color}, 0 14px 34px -20px ${cat.color}`
            : "0 10px 30px -18px rgba(40,36,70,.45)",
          opacity: unlocked ? 1 : 0.78,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 rounded-2xl p-1"
            style={{ backgroundColor: unlocked ? cat.soft : "#EEF0F5" }}
          >
            <CatAvatar cat={cat} size={76} mood={unlocked ? "idle" : "sleeping"} dim={!unlocked} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-800">{cat.region}</h3>
              {cat.hero && (
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-bold text-white">主角</span>
              )}
              {recommended && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  今日推荐
                </span>
              )}
              {!unlocked && (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {cat.unlock.text}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {cat.name} · {cat.breed} · {cat.ability}
            </p>

            {unlocked && (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {cat.stages.map((s, i) => (
                    <span key={s.name} className="flex items-center gap-0.5">
                      <Paw filled={i < cleared} color={cat.color} size={16} />
                    </span>
                  ))}
                  <span className="ml-1 text-xs text-slate-500">
                    {cleared}/{cat.stages.length} 关
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">好感度</span>
                  <div className="w-20">
                    <Bar value={affection % 25} max={25} color={cat.color} height="h-2" />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: cat.color }}>
                    {AFFECTION_TITLES[aff]}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Btn onClick={onEnter} color={cat.color} disabled={!unlocked}>
                {unlocked ? (cleared === 0 ? "开始冒险" : cleared >= cat.stages.length ? "再练一次" : "继续第 " + (cleared + 1) + " 关") : "尚未解锁"}
              </Btn>
              <Btn tone="ghost" color={cat.color} onClick={() => setOpen((v) => !v)} className="px-3 py-2">
                {open ? "收起档案" : "猫咪档案"}
              </Btn>
            </div>

            {open && (
              <div className="mt-3 rounded-2xl p-4 text-sm leading-relaxed text-slate-600" style={{ backgroundColor: cat.soft }}>
                <p><span className="font-semibold text-slate-700">性格：</span>{cat.trait}</p>
                <p className="mt-1"><span className="font-semibold text-slate-700">关卡：</span>{cat.stages.map((s) => s.name).join(" → ")}</p>
                <p className="mt-1"><span className="font-semibold text-slate-700">解锁：</span>{cat.unlock.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitPicker({ unit, onChange }) {
  const all = [{ id: 0, label: "全部", en: "All units", zh: "混合复习" }, ...BANK.units];
  return (
    <div className="rounded-3xl bg-white p-4" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-sm font-bold text-slate-800">今天练哪个部分</h3>
        <span className="text-xs text-slate-400">出题范围会跟着切换</span>
      </div>
      {all.length <= 7 ? (
        <div className="flex flex-wrap gap-2">
          {all.map((u) => {
            const on = u.id === unit;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => onChange(u.id)}
                className="rounded-2xl border-2 px-3 py-2 text-left text-xs font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  borderColor: on ? "#2A2540" : "#E2E5EE",
                  backgroundColor: on ? "#2A2540" : "#fff",
                  color: on ? "#fff" : "#475569",
                }}
              >
                <span className="block">{u.label || `Unit ${u.id}`}</span>
                <span className={`block text-xs font-normal ${on ? "opacity-80" : "text-slate-400"}`}>{u.zh}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <select
          value={unit}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-800"
        >
          {all.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label || `Unit ${u.id}`} · {u.zh}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function MapScreen({ state, level, inLevel, need, unlockedSet, recommendCatId, onEnter, onReview, onDayCard, onChangeCurriculum, curriculum, speechSupported, unit, onUnitChange }) {
  const reviewDue = state.review.filter((r) => r.streak < 3).length;
  const mastered = state.review.filter((r) => r.streak >= 3).length;
  const hero = CAT_BY_ID.mulan;
  const heroMood =
    state.daily.correct >= 12 ? "playful" : state.daily.stages > 0 ? "curious" : reviewDue >= 6 ? "skeptical" : "grumpy";
  const heroLine =
    state.daily.correct >= 12
      ? "今天的量够了。木兰假装在舔爪子，其实尾巴摇得挺快。"
      : state.daily.stages > 0
      ? "已经开了个头。再来一关，今天的目标就满了。"
      : reviewDue >= 6
      ? `复习清单堆到 ${reviewDue} 个了。木兰盯着你看，先去小屋清一轮吧。`
      : "木兰已经在门口坐了一会儿了。今天先做一关？";
  const onQuickStart = () => (recommendCatId === "mochi" ? onReview() : onEnter(recommendCatId));
  return (
    <div className="space-y-5">
      <div
        className="rounded-3xl p-5 sm:p-6"
        style={{ background: "linear-gradient(135deg,#E9ECF1 0%,#FAFBFC 65%)", boxShadow: "0 12px 34px -22px rgba(40,36,70,.6)" }}
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="shrink-0">
            <CatAvatar cat={hero} size={116} mood={heroMood} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 sm:text-3xl">木兰英语冒险</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{heroLine}</p>
            <p className="mt-1 text-xs text-slate-400">
              {curriculum.name} · {unit === 0 ? "全部范围" : BANK.units.find((u) => u.id === unit).zh} · 每天 10 分钟
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn color={hero.color} onClick={onQuickStart}>
                {state.daily.stages === 0 ? "开始今日挑战" : "继续今天的进度"}
              </Btn>
              <Btn tone="outline" color="#D96189" onClick={onReview}>
                复习小屋{reviewDue > 0 ? ` · ${reviewDue}` : ""}
              </Btn>
              <Btn tone="ghost" color="#64748B" onClick={onDayCard}>
                今天到这儿
              </Btn>
              <Btn tone="ghost" color="#64748B" onClick={onChangeCurriculum}>
                换教材
              </Btn>
            </div>
          </div>
        </div>
      </div>

      <StatHeader level={level} inLevel={inLevel} need={need} stars={state.stars} streak={state.streak} totalMastered={mastered} />

      {!speechSupported && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          当前浏览器不支持语音播放，听力关卡会以英文原文替代播放。建议改用 Chrome 或 Edge 获得完整听力体验。
        </div>
      )}

      <UnitPicker unit={unit} onChange={onUnitChange} />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative space-y-4">
            <span className="absolute bottom-6 left-4 top-6 w-0.5 rounded bg-slate-200" aria-hidden="true" />
            {CATS.map((cat) => (
              <RegionCard
                key={cat.id}
                cat={cat}
                unlocked={unlockedSet.has(cat.id)}
                progress={state.progress[cat.id] || { cleared: 0 }}
                affection={state.affection[cat.id] || 0}
                recommended={cat.id === recommendCatId}
                onEnter={() => (cat.kind === "review" ? onReview() : onEnter(cat.id))}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <DailyTasks daily={state.daily} />
          <div className="rounded-3xl bg-white p-5" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
            <h3 className="mb-2 text-sm font-bold text-slate-800">学习进度</h3>
            <p className="text-sm text-slate-500">
              复习清单里有 <span className="font-bold text-slate-800">{reviewDue}</span> 个待练内容，
              已掌握 <span className="font-bold text-slate-800">{mastered}</span> 个。
            </p>
            <div className="mt-3">
              <Bar value={mastered} max={Math.max(1, mastered + reviewDue)} color="#D96189" />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              题目为演示题库，可替换为你正在使用的教材词表与听力文本。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   8. 关卡页（单词 / 听力 / 综合 / 复习 共用引擎）
   --------------------------------------------------------------------- */

function AudioStage({ text, speech, big, revealText }) {
  const shownText = revealText || text;
  const [shown, setShown] = useState(false);
  useEffect(() => {
    setShown(false);
  }, [text]);

  if (!speech.supported) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-teal-300 bg-teal-50 p-5 text-center">
        <p className="text-xs font-semibold text-teal-700">当前浏览器不支持语音播放，以下为听力原文</p>
        <p className="mt-2 text-lg font-bold text-slate-800">{shownText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => speech.speak(text, 0.92)}
        aria-label="播放音频"
        className="relative flex items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
        style={{
          width: big ? 116 : 84,
          height: big ? 116 : 84,
          backgroundColor: "#1F9BA6",
          boxShadow: "0 12px 26px -12px rgba(31,155,166,.9)",
        }}
      >
        {speech.speaking && (
          <span className="absolute inset-0 animate-ping rounded-full" style={{ backgroundColor: "#1F9BA633" }} />
        )}
        <svg viewBox="0 0 24 24" width={big ? 46 : 34} height={big ? 46 : 34} fill="#fff">
          <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4zm-2.5-7.3v2.1a7 7 0 010 10.4v2.1a9 9 0 000-14.6z" />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <Btn tone="ghost" color="#1F9BA6" className="px-3 py-1.5 text-xs" onClick={() => speech.speak(text, 0.6)}>
          慢速再听
        </Btn>
        <Btn tone="ghost" color="#64748B" className="px-3 py-1.5 text-xs" onClick={() => setShown((v) => !v)}>
          {shown ? "隐藏原文" : "看不懂？显示原文"}
        </Btn>
      </div>
      {shown && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">{shownText}</p>}
    </div>
  );
}

function ChallengeScreen({ cat, stageName, questions, speech, onExit, onFinish, onMarkReview, markedKeys, autoAudio, onToggleAudio }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [placed, setPlaced] = useState([]);
  const [spelled, setSpelled] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [results, setResults] = useState([]);
  const [msg, setMsg] = useState("");
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const listening = Boolean(q.hideText);

  // 进入新卡片后停 1.5 秒，再自动播放一次音频（可在顶部关掉）
  useEffect(() => {
    if (!autoAudio || !q.audio) return;
    const t = setTimeout(() => speech.speak(q.audio, q.hideText ? 0.92 : 0.95), 1500);
    return () => clearTimeout(t);
  }, [q.qid, autoAudio]);

  const reset = () => {
    setPicked(null);
    setPlaced([]);
    setSpelled([]);
    setChecked(false);
    setIsRight(false);
    setMsg("");
  };

  const grade = (ok) => {
    setIsRight(ok);
    setChecked(true);
    setMsg(ok ? pick(cat.praise) : pick(cat.comfort));
    if (ok && q.audio && !q.hideText) speech.speak(q.audio, 0.95);
    setResults((r) => [...r, { q, ok }]);
    if (ok) {
      setCombo((c) => {
        const n = c + 1;
        setBestCombo((b) => Math.max(b, n));
        return n;
      });
    } else {
      setCombo(0);
      onMarkReview(q, true);
    }
  };

  const onChoose = (opt) => {
    if (checked) return;
    setPicked(opt);
    grade(opt === q.answer);
  };

  const submitOrder = () => {
    const built = placed.map((t) => t.text).join(" ");
    grade(built === q.answer);
  };

  const submitSpell = () => {
    grade(spelled.join("") === q.answer);
  };

  const next = () => {
    if (isLast) {
      onFinish([...results], bestCombo);
      return;
    }
    setIdx((i) => i + 1);
    reset();
  };

  const availableTokens = useMemo(
    () => (q.tokens || []).filter((t) => !placed.some((p) => p.tid === t.tid)),
    [q.tokens, placed]
  );
  const letterUsed = (i) => spelled.some((s) => s.i === i);

  const marked = markedKeys.has(`${q.item.type}:${q.item.id}`);

  return (
    <div className="mx-auto max-w-3xl">
      {/* 顶部状态条 */}
      <div className="mb-4 flex items-center gap-3">
        <Btn tone="ghost" color="#64748B" className="px-3 py-2 text-xs" onClick={onExit}>
          ← 退出
        </Btn>
        <div className="flex flex-1 items-center gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i < results.length ? (results[i].ok ? "#2E9E6B" : "#E4A11B") : i === idx ? cat.color : "#E2E5EE",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleAudio}
          className="rounded-xl px-2 py-1 text-xs font-semibold"
          style={{ color: autoAudio ? "#1F9BA6" : "#94A3B8", backgroundColor: autoAudio ? "#E2F5F6" : "#F1F5F9" }}
          title="进入题目 1.5 秒后自动播放"
        >
          {autoAudio ? "自动播放 开" : "自动播放 关"}
        </button>
        <span className="text-xs font-semibold text-slate-500">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <div className="rounded-3xl bg-white p-5 sm:p-7" style={{ boxShadow: "0 18px 40px -26px rgba(40,36,70,.6)" }}>
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl p-1" style={{ backgroundColor: cat.soft }}>
            <CatAvatar cat={cat} size={44} mood={checked ? (isRight ? "playful" : "skeptical") : "idle"} />
          </div>
          <div>
            <p className="text-xs text-slate-400">{cat.region} · {stageName}</p>
            <p className="text-sm font-bold" style={{ color: cat.color }}>{q.badge}</p>
          </div>
        </div>

        {combo >= 2 && !checked && (
          <div className="mb-4 flex items-center justify-center">
            <span
              className="animate-pulse rounded-full px-4 py-1.5 text-xs font-extrabold text-white"
              style={{ backgroundColor: combo >= 5 ? "#E0A93A" : cat.color }}
            >
              连对 {combo} 题{combo >= 5 ? " · 木兰坐直了" : ""}
            </span>
          </div>
        )}

        {/* 阅读短文 */}
        {q.passage && (
          <div className="mb-5 rounded-2xl bg-slate-50 p-4">
            <p className="mb-1 text-sm font-bold text-slate-700">{q.passage.title}</p>
            <p className="text-base leading-7 text-slate-600">{q.passage.text}</p>
          </div>
        )}

        {/* 对话 */}
        {q.dialogue && (
          <div className="mb-5 space-y-2">
            {q.dialogue.map((l, i) => (
              <div key={i} className={`flex ${i % 2 ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-xs rounded-2xl px-4 py-2 text-base"
                  style={{
                    backgroundColor: l.text === "____" ? cat.soft : "#F1F3F8",
                    border: l.text === "____" ? `2px dashed ${cat.color}` : "none",
                    color: "#333",
                  }}
                >
                  <span className="mr-2 text-xs font-bold text-slate-400">{l.who}</span>
                  {l.text === "____" ? (checked ? q.answer : "……") : l.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 听力区 */}
        {listening && (
          <div className="mb-6">
            <AudioStage text={q.audio} revealText={q.blanked} speech={speech} big />
            {q.blanked && (
              <p className="mx-auto mt-4 max-w-xl rounded-2xl bg-slate-50 px-4 py-3 text-center text-lg font-bold text-slate-700">
                {checked ? q.blanked.replace("______", q.answer) : q.blanked}
              </p>
            )}
          </div>
        )}

        {/* 看图选词 */}
        {q.picture && (
          <div className="mb-4 flex justify-center">
            <div
              className="flex items-center justify-center rounded-3xl"
              style={{ width: 132, height: 132, fontSize: 68, backgroundColor: cat.soft }}
              role="img"
              aria-label="题目图片"
            >
              {q.picture}
            </div>
          </div>
        )}

        {/* 题干 */}
        {!listening && q.prompt && (
          <div className="mb-2 flex items-start justify-center gap-3">
            <h2 className="text-center text-2xl font-extrabold leading-snug text-slate-800 sm:text-3xl">{q.prompt}</h2>
            {q.audio && speech.supported && (
              <button
                type="button"
                onClick={() => speech.speak(q.audio, 0.9)}
                aria-label="朗读"
                className="mt-1 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z" />
                </svg>
              </button>
            )}
          </div>
        )}
        <p className="mb-6 text-center text-sm text-slate-500">{q.promptSub}</p>

        {/* --- 选图题 --- */}
        {q.mode === "choice" && q.pictureOptions && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {q.options.map((opt) => {
              const isAnswer = opt === q.answer;
              const isPicked = opt === picked;
              let style = { borderColor: "#E2E5EE", backgroundColor: "#fff" };
              if (checked && isAnswer) style = { borderColor: "#2E9E6B", backgroundColor: "#E8F6EF" };
              else if (checked && isPicked) style = { borderColor: "#E4A11B", backgroundColor: "#FDF4E3" };
              else if (checked) style = { ...style, opacity: 0.5 };
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={checked}
                  onClick={() => onChoose(opt)}
                  style={{ ...style, fontSize: 46 }}
                  className="flex items-center justify-center rounded-2xl border-2 py-5 transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* --- 选择题 --- */}
        {q.mode === "choice" && !q.pictureOptions && (
          <div className="grid gap-3 sm:grid-cols-2">
            {q.options.map((opt) => {
              const isAnswer = opt === q.answer;
              const isPicked = opt === picked;
              let style = { borderColor: "#E2E5EE", backgroundColor: "#fff", color: "#334155" };
              if (checked && isAnswer) style = { borderColor: "#2E9E6B", backgroundColor: "#E8F6EF", color: "#166B4A" };
              else if (checked && isPicked) style = { borderColor: "#E4A11B", backgroundColor: "#FDF4E3", color: "#8A6100" };
              else if (checked) style = { ...style, opacity: 0.55 };
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={checked}
                  onClick={() => onChoose(opt)}
                  style={style}
                  className="rounded-2xl border-2 px-4 py-4 text-left text-base font-semibold transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:hover:translate-y-0"
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* --- 拼写题 --- */}
        {q.mode === "spell" && (
          <div>
            <div
              className="mb-4 flex flex-wrap items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed p-3"
              style={{ borderColor: `${cat.color}66`, backgroundColor: cat.soft, minHeight: "4rem" }}
            >
              {spelled.length === 0 && <span className="text-sm text-slate-400">点击下方字母开始拼写</span>}
              {spelled.map((s, i) => (
                <span key={i} className="rounded-xl bg-white px-3 py-2 text-xl font-extrabold text-slate-800">
                  {s.ch}
                </span>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {q.letters.map((ch, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={checked || letterUsed(i)}
                  onClick={() => setSpelled((s) => [...s, { ch, i }])}
                  className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-xl font-extrabold text-slate-700 transition-transform hover:-translate-y-0.5 disabled:opacity-25"
                >
                  {ch}
                </button>
              ))}
            </div>
            {!checked && (
              <div className="flex justify-center gap-2">
                <Btn tone="ghost" color="#64748B" onClick={() => setSpelled((s) => s.slice(0, -1))} disabled={!spelled.length}>
                  删除一个
                </Btn>
                <Btn color={cat.color} onClick={submitSpell} disabled={!spelled.length}>
                  检查拼写
                </Btn>
              </div>
            )}
          </div>
        )}

        {/* --- 排序题 --- */}
        {q.mode === "order" && (
          <div>
            <div
              className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed p-3"
              style={{ borderColor: `${cat.color}66`, backgroundColor: cat.soft, minHeight: "4rem" }}
            >
              {placed.length === 0 && <span className="text-sm text-slate-400">点击下方词块，按顺序放进来</span>}
              {placed.map((t) => (
                <button
                  key={t.tid}
                  type="button"
                  disabled={checked}
                  onClick={() => setPlaced((p) => p.filter((x) => x.tid !== t.tid))}
                  className="rounded-xl bg-white px-3 py-2 text-base font-semibold text-slate-800 shadow-sm"
                >
                  {t.text}
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {availableTokens.map((t) => (
                <button
                  key={t.tid}
                  type="button"
                  disabled={checked}
                  onClick={() => setPlaced((p) => [...p, t])}
                  className="rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-700 transition-transform hover:-translate-y-0.5 disabled:opacity-30"
                >
                  {t.text}
                </button>
              ))}
              {availableTokens.length === 0 && !checked && <span className="text-sm text-slate-400">词块都用完了，检查一下顺序</span>}
            </div>
            {!checked && (
              <div className="flex justify-center gap-2">
                <Btn tone="ghost" color="#64748B" onClick={() => setPlaced([])} disabled={!placed.length}>
                  全部取回
                </Btn>
                <Btn color={cat.color} onClick={submitOrder} disabled={!placed.length}>
                  检查句子
                </Btn>
              </div>
            )}
          </div>
        )}

        {/* --- 反馈 --- */}
        {checked && (
          <div
            className="mt-6 rounded-2xl p-5"
            style={{ backgroundColor: isRight ? "#E8F6EF" : "#FDF4E3" }}
          >
            <div className="flex items-start gap-3">
              <div className={isRight ? "animate-bounce" : ""}>
                <CatAvatar cat={cat} size={52} mood={isRight ? "playful" : "skeptical"} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-extrabold ${isRight ? "text-emerald-700" : "text-amber-700"}`}>
                  {isRight ? "答对了" : `正确答案：${q.answer}`}
                </p>
                <p className="mt-1 text-sm text-slate-700">{msg}</p>
                <p className="mt-1 text-sm text-slate-500">{q.explain}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Btn color={cat.color} onClick={next}>
                    {isLast ? "看本关总结" : "下一题"}
                  </Btn>
                  {q.audio && speech.supported && (
                    <Btn tone="ghost" color="#1F9BA6" onClick={() => speech.speak(q.audio, 0.85)} className="px-3 py-2 text-xs">
                      再听一次
                    </Btn>
                  )}
                  <Btn
                    tone="ghost"
                    color="#D96189"
                    className="px-3 py-2 text-xs"
                    onClick={() => onMarkReview(q, !marked)}
                  >
                    {marked ? "✓ 已在复习清单（点击移出）" : "加入复习清单"}
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   9. 结算页
   --------------------------------------------------------------------- */

function ResultScreen({ cat, summary, onRetry, onNext, onReview, onMap, onDayCard }) {
  const { total, correct, stars, xp, learned, missed, stageName, hasNext, nextName, bestCombo, comboBonus, bonusPaw } = summary;
  const acc = Math.round((correct / Math.max(1, total)) * 100);
  const headline = acc >= 90 ? "这一关几乎全对" : acc >= 70 ? "稳住了，大部分都对" : acc >= 50 ? "过关了，还有几个词要补" : "先把错的几个练熟再来";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-white p-6 sm:p-8" style={{ boxShadow: "0 18px 40px -26px rgba(40,36,70,.6)" }}>
        <div className="flex flex-col items-center text-center">
          <div className="rounded-3xl p-2" style={{ backgroundColor: cat.soft }}>
            <CatAvatar cat={cat} size={100} mood={acc >= 90 ? "playful" : acc >= 50 ? "curious" : "sad"} />
          </div>
          <p className="mt-3 text-xs text-slate-400">{cat.region} · {stageName}</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-800">{headline}</h2>

          <div className="mt-4 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={i < stars ? "animate-bounce" : ""} style={{ animationDelay: `${i * 120}ms` }}>
                <Paw filled={i < stars} color={cat.color} size={30} />
              </span>
            ))}
          </div>

          {(comboBonus > 0 || bonusPaw > 0) && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {comboBonus > 0 && (
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  最高连对 {bestCombo} 题 · 额外 +{comboBonus} 经验
                </span>
              )}
              {bonusPaw > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  木兰从摊位底下扒出一枚猫爪印 +1
                </span>
              )}
            </div>
          )}

          <div className="mt-5 grid w-full grid-cols-3 gap-3">
            {[
              { k: "正确率", v: `${acc}%` },
              { k: "答对题数", v: `${correct}/${total}` },
              { k: "获得经验", v: `+${xp}` },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-lg font-extrabold text-slate-800">{s.v}</p>
                <p className="text-xs text-slate-500">{s.k}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="mb-2 text-sm font-bold text-emerald-800">这一关学过的内容</p>
            {learned.length ? (
              <ul className="space-y-1 text-sm text-emerald-900">
                {learned.slice(0, 6).map((l) => (
                  <li key={l.id + l.en}>{l.en}{l.type === "word" ? ` · ${l.zh}` : ""}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-900">这一关没有完全掌握的内容，去复习小屋练两遍。</p>
            )}
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="mb-2 text-sm font-bold text-rose-800">麻薯帮你收走的内容</p>
            {missed.length ? (
              <ul className="space-y-1 text-sm text-rose-900">
                {missed.map((l) => (
                  <li key={l.id + l.en}>{l.en}{l.type === "word" ? ` · ${l.zh}` : ""}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-rose-900">全对，没有要复习的内容。</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {hasNext && (
            <Btn color={cat.color} onClick={onNext}>
              进入下一关 · {nextName}
            </Btn>
          )}
          <Btn tone="outline" color={cat.color} onClick={onRetry}>
            再玩一次
          </Btn>
          {missed.length > 0 && (
            <Btn tone="outline" color="#D96189" onClick={onReview}>
              去复习小屋
            </Btn>
          )}
          <Btn tone="ghost" color="#64748B" onClick={onMap}>
            回地图
          </Btn>
          <Btn tone="ghost" color="#5A6573" onClick={onDayCard}>
            今天就到这儿
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   10. 复习小屋
   --------------------------------------------------------------------- */

const MASTERY = [
  { label: "新学", color: "#E4A11B", bg: "#FDF4E3" },
  { label: "练习中", color: "#7257C8", bg: "#EEEAFB" },
  { label: "练习中", color: "#7257C8", bg: "#EEEAFB" },
  { label: "已掌握", color: "#2E9E6B", bg: "#E8F6EF" },
];

function ReviewScreen({ items, onStart, onBack, onRemove, unlocked }) {
  const mochi = CAT_BY_ID.mochi;
  const due = items.filter((i) => i.streak < 3);
  const mastered = items.filter((i) => i.streak >= 3);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Btn tone="ghost" color="#64748B" className="px-3 py-2 text-xs" onClick={onBack}>
          ← 回地图
        </Btn>
      </div>

      <div className="rounded-3xl p-6" style={{ backgroundColor: mochi.soft }}>
        <div className="flex flex-wrap items-center gap-4">
          <CatAvatar cat={mochi} size={92} mood={due.length ? "curious" : "playful"} />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-slate-800">复习小屋</h2>
            <p className="mt-1 text-sm text-slate-600">
              {unlocked
                ? due.length
                  ? `麻薯这里有 ${due.length} 个内容等你再练一遍，连续答对 3 次就算掌握。`
                  : "清单是空的。做几关挑战，答错的内容会自动被麻薯抱回来。"
                : `再收集 ${Math.max(0, 2 - items.length)} 个复习内容，麻薯就会出现。`}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Btn color={mochi.color} onClick={onStart} disabled={!due.length}>
                开始复习（{Math.min(6, due.length)} 题）
              </Btn>
              <span className="text-xs text-slate-500">已掌握 {mastered.length} · 待练 {due.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
        <h3 className="mb-3 text-sm font-bold text-slate-800">我的学习记录</h3>
        {items.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            还没有记录。去词语集市做一关，错题会自动出现在这里。
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((it) => {
              const m = MASTERY[Math.min(3, it.streak)];
              return (
                <li key={it.key} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-800">{it.en}</p>
                    <p className="truncate text-xs text-slate-500">{it.zh}</p>
                  </div>
                  <div className="w-24">
                    <Bar value={Math.min(3, it.streak)} max={3} color={m.color} height="h-1.5" />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-bold"
                    style={{ color: m.color, backgroundColor: m.bg }}
                  >
                    {m.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(it.key)}
                    className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label={`移出 ${it.en}`}
                  >
                    移出
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
   10.5 今日小结卡：点评 + 署名 + 分享
   --------------------------------------------------------------------- */

// 依据今天的实际数据生成点评，语气以鼓励和具体表扬为主
function buildComment(daily, streak, level, masteredCount) {
  const acc = daily.answered ? Math.round((daily.correct / daily.answered) * 100) : 0;
  const lines = [];

  if (daily.answered === 0) {
    return ["今天还没开始。木兰把词卡摆好了，随时可以坐下来练一关。"];
  }

  if (acc >= 90) lines.push(`今天做了 ${daily.answered} 题，答对 ${daily.correct} 题，正确率 ${acc}%。这个水平已经很稳了。`);
  else if (acc >= 75) lines.push(`今天做了 ${daily.answered} 题，正确率 ${acc}%。大部分题一遍就过，节奏抓得不错。`);
  else if (acc >= 55) lines.push(`今天做了 ${daily.answered} 题，答对 ${daily.correct} 题。错的那几个已经进了复习清单，下次见面就不陌生了。`);
  else lines.push(`今天做了 ${daily.answered} 题。正确率还会往上走，能把题做完本身就值得记一笔。`);

  if (daily.stages >= 3) lines.push(`连做了 ${daily.stages} 关，专注力很够。`);
  else if (daily.stages === 2) lines.push("完成了两关，刚好是今天的目标。");

  if (daily.reviewed > 0) lines.push(`还回复习小屋练了 ${daily.reviewed} 题，复习是最难坚持的部分，你做到了。`);
  if (daily.bestCombo >= 5) lines.push(`中间还连对了 ${daily.bestCombo} 题，手感很好。`);
  else if (daily.bestCombo >= 3) lines.push(`最高连对 ${daily.bestCombo} 题。`);
  if (daily.words.length > 0) lines.push(`今天正面拿下的词有 ${daily.words.length} 个。`);
  if (masteredCount > 0) lines.push(`目前已掌握 ${masteredCount} 个内容。`);
  if (streak >= 2) lines.push(`连续学习 ${streak} 天，木兰记着呢。`);

  lines.push("明天见。");
  return lines;
}

function wrapText(str, per) {
  const out = [];
  for (let i = 0; i < str.length; i += per) out.push(str.slice(i, i + per));
  return out;
}

function DayCard({ state, level, playerName, onNameChange, onBack }) {
  const mulan = CAT_BY_ID.mulan;
  const name = playerName;
  const [copied, setCopied] = useState("");
  const daily = state.daily;
  const mastered = state.review.filter((r) => r.streak >= 3).length;
  const acc = daily.answered ? Math.round((daily.correct / daily.answered) * 100) : 0;
  const comment = useMemo(() => buildComment(daily, state.streak, level, mastered), [daily, state.streak, level, mastered]);
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  const who = name.trim() || "这位同学";

  const shareText =
    `${who} 的木兰英语冒险 · ${today}\n` +
    `完成 ${daily.stages} 关 · 答对 ${daily.correct}/${daily.answered} 题 · 正确率 ${acc}%\n` +
    `获得经验 ${daily.xp} · 猫爪印 ${daily.stars} · 最高连对 ${daily.bestCombo} 题 · 连续学习 ${state.streak} 天\n` +
    (daily.words.length ? `今天拿下的词：${daily.words.slice(0, 8).map((w) => w.en).join(", ")}\n` : "") +
    comment.join("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied("文字已复制，可以直接粘贴给好友");
    } catch (e) {
      setCopied("复制没成功，可以长按上面的卡片手动选择文字");
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "木兰英语冒险 · 今日小结", text: shareText });
      } catch (e) {
        /* 用户取消分享，不做处理 */
      }
    } else {
      copy();
    }
  };

  // 把小结画成一张 SVG，再转成 PNG 下载，不依赖任何外部库
  const savePng = () => {
    const W = 720;
    const H = 1040;
    const stat = (x, y, v, k) =>
      `<text x="${x}" y="${y}" font-size="40" font-weight="700" fill="#2A2540">${v}</text>` +
      `<text x="${x}" y="${y + 26}" font-size="18" fill="#8A93A0">${k}</text>`;
    const commentLines = comment.flatMap((c) => wrapText(c, 20));
    const commentSvg = commentLines
      .map((l, i) => `<text x="60" y="${630 + i * 34}" font-size="21" fill="#3F4756">${l}</text>`)
      .join("");
    const wordsLine = daily.words.slice(0, 6).map((w) => `${w.en} ${w.zh}`).join("   ");

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <rect width="${W}" height="${H}" fill="#F1F3F8"/>
      <rect x="32" y="32" width="${W - 64}" height="${H - 64}" rx="36" fill="#FFFFFF"/>
      <rect x="32" y="32" width="${W - 64}" height="150" rx="36" fill="#E9ECF1"/>
      <text x="60" y="100" font-size="34" font-weight="800" fill="#2A2540">木兰英语冒险 · 今日小结</text>
      <text x="60" y="140" font-size="20" fill="#8A93A0">${today}</text>
      <text x="60" y="245" font-size="30" font-weight="700" fill="#2A2540">${who}</text>
      <text x="60" y="280" font-size="19" fill="#8A93A0">等级 ${level} · 连续学习 ${state.streak} 天</text>
      <line x1="60" y1="320" x2="${W - 60}" y2="320" stroke="#E2E5EE" stroke-width="2"/>
      ${stat(60, 400, daily.stages, "完成关卡")}
      ${stat(230, 400, `${daily.correct}/${daily.answered}`, "答对题数")}
      ${stat(450, 400, `${acc}%`, "正确率")}
      ${stat(60, 500, daily.xp, "获得经验")}
      ${stat(230, 500, daily.stars, "猫爪印")}
      ${stat(450, 500, daily.reviewed, "复习题数")}
      <line x1="60" y1="550" x2="${W - 60}" y2="550" stroke="#E2E5EE" stroke-width="2"/>
      <text x="60" y="595" font-size="22" font-weight="700" fill="#5A6573">木兰的点评</text>
      ${commentSvg}
      <text x="60" y="${H - 120}" font-size="19" fill="#8A93A0">今天拿下的词</text>
      <text x="60" y="${H - 88}" font-size="20" fill="#3F4756">${wordsLine || "下次再来收集"}</text>
      <text x="60" y="${H - 50}" font-size="17" fill="#B4BAC4">演示题库 · 参照五年级上册 Unit 1-6 单元结构</text>
    </svg>`;

    try {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = W * 2;
        canvas.height = H * 2;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        canvas.toBlob((b) => {
          if (!b) {
            setCopied("这个浏览器不支持保存图片，可以改用「复制文字」");
            return;
          }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = `木兰英语冒险-${today}.png`;
          a.click();
          setCopied("图片已保存到下载文件夹");
        });
      };
      img.onerror = () => setCopied("这个浏览器不支持保存图片，可以改用「复制文字」");
      img.src = url;
    } catch (e) {
      setCopied("这个浏览器不支持保存图片，可以改用「复制文字」");
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="rounded-3xl bg-white p-6 sm:p-8" style={{ boxShadow: "0 18px 40px -26px rgba(40,36,70,.6)" }}>
        <div className="flex items-center gap-4">
          <div className="rounded-3xl p-1" style={{ backgroundColor: mulan.soft }}>
            <CatAvatar cat={mulan} size={84} mood={daily.answered ? "playful" : "grumpy"} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">今日小结</h2>
            <p className="text-sm text-slate-500">{today} · 等级 {level} · 连续 {state.streak} 天</p>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-xs font-semibold text-slate-500" htmlFor="playerName">
            署名（会印在卡片上）
          </label>
          <input
            id="playerName"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="写上你的名字"
            maxLength={16}
            className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-base font-semibold text-slate-800 focus:outline-none"
            style={{ borderColor: name ? mulan.color : undefined }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { k: "完成关卡", v: daily.stages },
            { k: "答对题数", v: `${daily.correct}/${daily.answered}` },
            { k: "正确率", v: `${acc}%` },
            { k: "获得经验", v: daily.xp },
            { k: "猫爪印", v: daily.stars },
            { k: "复习题数", v: daily.reviewed },
          ].map((t) => (
            <div key={t.k} className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-lg font-extrabold text-slate-800">{t.v}</p>
              <p className="text-xs text-slate-500">{t.k}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl p-5" style={{ backgroundColor: mulan.soft }}>
          <p className="mb-2 text-sm font-bold" style={{ color: mulan.color }}>木兰的点评</p>
          <p className="text-base leading-7 text-slate-700">{comment.join("")}</p>
        </div>

        {daily.words.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-slate-500">今天拿下的词</p>
            <div className="flex flex-wrap gap-2">
              {daily.words.slice(0, 10).map((w) => (
                <span key={w.id} className="rounded-xl bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
                  {w.en} · {w.zh}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Btn color={mulan.color} onClick={share}>
          分享给好友
        </Btn>
        <Btn tone="outline" color={mulan.color} onClick={copy}>
          复制文字
        </Btn>
        <Btn tone="outline" color="#2E9E6B" onClick={savePng}>
          保存为图片
        </Btn>
        <Btn tone="ghost" color="#64748B" onClick={onBack}>
          回地图
        </Btn>
      </div>
      {copied && <p className="text-center text-xs text-slate-500">{copied}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------------
   11. 根组件：状态、解锁、路由
   --------------------------------------------------------------------- */

// 两条路径任满足其一即可解锁：练到等级，或在前一个区域有进展
function unlockedIds(level, reviewCount, progress = {}) {
  const cleared = (id) => progress[id]?.cleared || 0;
  const set = new Set(["mulan"]);
  if (level >= 2 || cleared("mulan") >= 1) set.add("echo");
  if (level >= 3 || cleared("echo") >= 1) set.add("pepper");
  if (reviewCount >= 2) set.add("mochi");
  if (level >= 5 || (cleared("mulan") >= 2 && cleared("echo") >= 2) || cleared("pepper") >= 2) set.add("luna");
  return set;
}

export default function MulanEnglishQuest() {
  const speech = useSpeech();
  const [view, setView] = useState("start");
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [unit, setUnit] = useState(0); // 0 = 全部单元
  const [playerName, setPlayerName] = useState("");
  const [autoAudio, setAutoAudio] = useState(true);
  const [curriculumId, setCurriculumId] = useState(CURRICULA[0].id);
  const curriculum = CURRICULUM_BY_ID[curriculumId];

  const pickCurriculum = (id) => {
    const c = setCurriculum(id);
    setCurriculumId(id);
    setUnit(c.bank.defaultUnit || 0);
    setView("map");
  };
  const [state, setState] = useState({
    xp: 0,
    stars: 0,
    streak: 0,
    streakBumped: false,
    progress: {},   // { catId: { cleared: n } }
    affection: {},  // { catId: points }
    review: [],     // [{ key, type, id, en, zh, streak, wrong, snapshot }]
    daily: { stages: 0, correct: 0, answered: 0, reviewed: 0, xp: 0, stars: 0, bestCombo: 0, words: [] },
  });

  const { level, inLevel, need } = levelFromXp(state.xp);
  const unlockedSet = useMemo(
    () => unlockedIds(level, state.review.length, state.progress),
    [level, state.review.length, state.progress]
  );
  const markedKeys = useMemo(() => new Set(state.review.map((r) => r.key)), [state.review]);
  const dueItems = state.review.filter((r) => r.streak < 3);

  const recommendCatId = useMemo(() => {
    if (unlockedSet.has("mochi") && dueItems.length >= 5) return "mochi";
    const next = CATS.find(
      (c) => c.kind !== "review" && unlockedSet.has(c.id) && (state.progress[c.id]?.cleared || 0) < c.stages.length
    );
    return next ? next.id : "mulan";
  }, [unlockedSet, state.progress, dueItems.length]);

  const markReview = useCallback((q, add) => {
    const key = `${q.item.type}:${q.item.id}`;
    setState((s) => {
      const exists = s.review.find((r) => r.key === key);
      if (!add) return { ...s, review: s.review.filter((r) => r.key !== key) };
      if (exists)
        return { ...s, review: s.review.map((r) => (r.key === key ? { ...r, wrong: r.wrong + 1, streak: 0 } : r)) };
      return {
        ...s,
        review: [
          ...s.review,
          {
            key,
            type: q.item.type,
            id: q.item.id,
            en: q.item.en,
            zh: q.item.zh,
            streak: 0,
            wrong: 1,
            snapshot: q.item.type === "note" ? q : null,
          },
        ],
      };
    });
  }, []);

  const startStage = (catId, stageIndex) => {
    const cat = CAT_BY_ID[catId];
    const stage = cat.stages[stageIndex];
    setSession({
      catId,
      stageIndex,
      stageName: stage.name,
      questions: buildStage(cat, stageIndex, unit),
      isReview: false,
    });
    setView("play");
  };

  const startReview = () => {
    const qs = buildReviewStage(dueItems, 6);
    if (!qs.length) {
      setView("review");
      return;
    }
    setSession({ catId: "mochi", stageIndex: 0, stageName: "今日复习", questions: qs, isReview: true });
    setView("play");
  };

  const finishStage = (results, bestCombo = 0) => {
    const total = results.length;
    const correct = results.filter((r) => r.ok).length;
    const acc = correct / Math.max(1, total);
    const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : acc >= 0.5 ? 1 : 0;
    const comboBonus = bestCombo >= 3 ? bestCombo * 3 : 0;
    const xpGain = correct * 10 + stars * 5 + comboBonus;
    // 小惊喜：表现不错时，木兰偶尔会从摊位底下扒出一枚猫爪印
    const bonusPaw = acc >= 0.7 && Math.random() < 0.35 ? 1 : 0;
    const cat = CAT_BY_ID[session.catId];

    const uniq = (list) => {
      const seen = new Set();
      return list.filter((i) => (seen.has(i.en) ? false : (seen.add(i.en), true)));
    };
    const learned = uniq(results.filter((r) => r.ok).map((r) => r.q.item));
    const missed = uniq(results.filter((r) => !r.ok).map((r) => r.q.item));
    const correctKeys = results.filter((r) => r.ok).map((r) => `${r.q.item.type}:${r.q.item.id}`);

    const before = unlockedIds(level, state.review.length, state.progress);

    setState((s) => {
      const nextXp = s.xp + xpGain;
      const cleared = s.progress[cat.id]?.cleared || 0;
      const passed = acc >= 0.6 && !session.isReview;
      return {
        ...s,
        xp: nextXp,
        stars: s.stars + stars + bonusPaw,
        streak: s.streakBumped ? s.streak : s.streak + 1,
        streakBumped: true,
        progress: session.isReview
          ? s.progress
          : { ...s.progress, [cat.id]: { cleared: passed ? Math.max(cleared, session.stageIndex + 1) : cleared } },
        affection: { ...s.affection, [cat.id]: (s.affection[cat.id] || 0) + correct * 3 },
        review: s.review.map((r) =>
          correctKeys.includes(r.key) ? { ...r, streak: Math.min(5, r.streak + 1) } : r
        ),
        daily: {
          stages: s.daily.stages + 1,
          correct: s.daily.correct + correct,
          answered: s.daily.answered + total,
          reviewed: s.daily.reviewed + (session.isReview ? total : 0),
          xp: s.daily.xp + xpGain,
          bestCombo: Math.max(s.daily.bestCombo || 0, bestCombo),
          stars: s.daily.stars + stars + bonusPaw,
          words: uniq([
            ...s.daily.words,
            ...learned.filter((i) => i.type === "word"),
          ]),
        },
      };
    });

    const afterLevel = levelFromXp(state.xp + xpGain).level;
    const clearedNow = acc >= 0.6 && !session.isReview ? session.stageIndex + 1 : state.progress[cat.id]?.cleared || 0;
    const after = unlockedIds(afterLevel, state.review.length + missed.length, {
      ...state.progress,
      [cat.id]: { cleared: Math.max(state.progress[cat.id]?.cleared || 0, clearedNow) },
    });
    const newlyUnlocked = [...after].filter((id) => !before.has(id)).map((id) => CAT_BY_ID[id]);

    setSummary({
      catId: cat.id,
      total,
      correct,
      stars,
      xp: xpGain,
      bestCombo,
      comboBonus,
      bonusPaw,
      learned,
      missed,
      stageName: session.stageName,
      stageIndex: session.stageIndex,
      isReview: session.isReview,
      hasNext: !session.isReview && acc >= 0.6 && session.stageIndex + 1 < cat.stages.length,
      nextName: cat.stages[session.stageIndex + 1]?.name,
      newlyUnlocked,
    });
    setView("result");
  };

  const fontStack = '"Nunito", "Quicksand", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif';

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:px-6 sm:py-10" style={{ backgroundColor: "#F1F3F8", fontFamily: fontStack }}>
      <div className="mx-auto max-w-5xl">
        {view === "start" && <CurriculumScreen current={curriculumId} onPick={pickCurriculum} />}

        {view === "map" && (
          <MapScreen
            state={state}
            level={level}
            inLevel={inLevel}
            need={need}
            unlockedSet={unlockedSet}
            recommendCatId={recommendCatId}
            speechSupported={speech.supported}
            unit={unit}
            onUnitChange={setUnit}
            onEnter={(catId) => startStage(catId, Math.min((state.progress[catId]?.cleared || 0), CAT_BY_ID[catId].stages.length - 1))}
            onReview={() => setView("review")}
            onDayCard={() => setView("summary")}
            onChangeCurriculum={() => setView("start")}
            curriculum={curriculum}
          />
        )}

        {view === "play" && session && (
          <ChallengeScreen
            cat={CAT_BY_ID[session.catId]}
            stageName={session.stageName}
            questions={session.questions}
            speech={speech}
            markedKeys={markedKeys}
            onMarkReview={markReview}
            autoAudio={autoAudio}
            onToggleAudio={() => setAutoAudio((v) => !v)}
            onExit={() => setView("map")}
            onFinish={finishStage}
          />
        )}

        {view === "result" && summary && (
          <div className="space-y-4">
            {summary.newlyUnlocked.length > 0 && (
              <div className="mx-auto max-w-2xl rounded-3xl bg-white p-4" style={{ boxShadow: "0 10px 30px -18px rgba(40,36,70,.45)" }}>
                <div className="flex items-center gap-3">
                  {summary.newlyUnlocked.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <div className="animate-bounce rounded-2xl p-1" style={{ backgroundColor: c.soft }}>
                        <CatAvatar cat={c} size={44} mood="playful" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        新区域解锁：{c.region}
                        <span className="block text-xs font-normal text-slate-500">{c.name}（{c.breed}）加入了你的队伍</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ResultScreen
              cat={CAT_BY_ID[summary.catId]}
              summary={summary}
              onRetry={() => (summary.isReview ? startReview() : startStage(summary.catId, summary.stageIndex))}
              onNext={() => startStage(summary.catId, summary.stageIndex + 1)}
              onReview={() => setView("review")}
              onMap={() => setView("map")}
              onDayCard={() => setView("summary")}
            />
          </div>
        )}

        {view === "summary" && (
          <DayCard
            state={state}
            level={level}
            playerName={playerName}
            onNameChange={setPlayerName}
            onBack={() => setView("map")}
          />
        )}

        {view === "review" && (
          <ReviewScreen
            items={state.review}
            unlocked={unlockedSet.has("mochi")}
            onStart={startReview}
            onBack={() => setView("map")}
            onRemove={(key) => setState((s) => ({ ...s, review: s.review.filter((r) => r.key !== key) }))}
          />
        )}

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          演示题库：词表与语法点按所选教材的公开目录整理，例句、对话与短文为自编示例，不是教材原文。
        </p>
      </div>
    </div>
  );
}
