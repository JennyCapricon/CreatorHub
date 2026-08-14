// ============================================================================
// Creator Hub — Human Content Engine
// Turns niche, platform, content type, tone and topic into posts that sound
// like a real creator wrote them — not like they were generated.
// ============================================================================

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rng, arr) => (arr && arr.length ? arr[Math.floor(rng() * arr.length)] : "");
const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const slug = (s = "") => s.toLowerCase().replace(/[^a-z0-9]+/g, "").replace(/^[0-9]+/, "");
const cap = (s = "") => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// ---------------------------------------------------------------------------
// Creator profiles (niche-specific vocabulary, moments, wins, takes, tips)
// ---------------------------------------------------------------------------

const profiles = {
  "web developer": {
    key: "webdeveloper",
    label: "web developer",
    people: "developers",
    aPerson: "a developer",
    hashtags: ["#webdev", "#coding", "#programming", "#developer", "#100DaysOfCode"],
    situations: [
      "Spent four hours yesterday chasing a bug. The fix was one missing semicolon. Four. Hours.",
      "Deployed to production at 11:47pm because \"it works on my machine\"... then immediately broke everything.",
      "Client asked for a \"tiny change\" at 5pm on Friday. Six hours later I've refactored half the codebase.",
      "Wrote a feature, tested it, shipped it, celebrated, and then found the edge case I didn't test.",
      "Tried to center a div. It's been 6 hours. CSS has truly humbled me.",
    ],
    frustrations: [
      "Error messages that say absolutely nothing.",
      "CSS when you're just trying to center a div.",
      "Comments in the code that say \"fix this later\" — I am later now.",
      "The meeting that could have been a message.",
      "Copy-pasting a Stack Overflow fix and hoping for the best.",
    ],
    wins: [
      "Finally shipped the feature I'd been dreading for two weeks.",
      "Debugged someone else's code without crying. Progress.",
      "My code worked on the first try today. First try. I don't know what to do with myself.",
      "Refactored the messy legacy file nobody wanted to touch.",
      "Fixed a bug the whole team assumed was \"just a browser issue\".",
    ],
    tips: [
      "Start with the dumbest possible fix. Most bugs are typos and cache.",
      "Write the error down before you Google it. It's always the one sentence you skip.",
      "Refactor as you go, not after the deadline.",
      "Read the error message. Like, actually read the whole thing.",
      "If the bug only happens sometimes, it's almost never what you think it is.",
    ],
    hotTakes: [
      "If your code needs a 200-line comment to explain itself, the problem isn't the reader.",
      "\"I'll add tests later\" is how every legacy codebase starts.",
      "Meetings could have been emails. Or better yet, deleted.",
      "If you can't explain it to a rubber duck, you don't understand it.",
    ],
    questions: [
      "What's a bug you've spent way too long on, only for the fix to be embarrassingly simple?",
      "Do you actually plan your code first, or do you wing it and pray?",
      "What's the one tool that changed how you write code forever?",
      "How do you deal with imposter syndrome in a room full of people who seem to know everything?",
    ],
    funny: [
      "My git commit messages are basically therapy notes.",
      "I don't have a favorite color. I have a favorite line height.",
      "The code works. I don't know why. I'm not asking questions.",
      "I'll start documenting the project. Right after I finish this one thing.",
    ],
  },

  "fashion creator": {
    key: "fashion",
    label: "fashion creator",
    people: "fashion girlies",
    aPerson: "someone who owns too many black clothes",
    hashtags: ["#fashion", "#style", "#outfitideas", "#ootd", "#fashioninspo"],
    situations: [
      "Tried on 14 outfits this morning. Wore the first one I tried on.",
      "Bought the \"perfect\" dress in two colors because I couldn't decide. No regrets. Yet.",
      "Getting ready took 90 minutes and I somehow look the same as I do in sweatpants.",
      "The outfit looked amazing in my mirror. The camera said absolutely not.",
      "Saw a piece in a shop window, bought it, and have owned it for 3 months without a single occasion.",
    ],
    frustrations: [
      "When the outfit slaps in the mirror but the camera says no.",
      "Clothes I've never worn but can't let go of.",
      "Fitting room lighting. That's it. That's the post.",
      "Finding something in my size that isn't the one in a different shade.",
      "\"It'll look better with different shoes\" — famous last words.",
    ],
    wins: [
      "Wore something bold and got asked where it's from three times in one day.",
      "Finally styled the piece I bought months ago and it actually worked.",
      "The thrift find of the century. Fits like it was made for me.",
      "Put together a whole outfit from stuff I already owned. Felt like a stylist.",
    ],
    tips: [
      "Buy pieces that go with at least three things you already own.",
      "A good belt and good shoes will fix 90% of your outfits.",
      "If it doesn't fit in the store, it won't fit at home. Size isn't a personality trait.",
      "Style the piece 3 ways before you buy it. If you can't, you won't wear it.",
    ],
    hotTakes: [
      "Fashion rules are made up. Wear white after Labor Day.",
      "Matching sets are the most underrated thing in my closet.",
      "You don't need a capsule wardrobe. You need a wardrobe you actually wear.",
    ],
    questions: [
      "What's the piece you keep buying in different colors?",
      "Would you wear something \"out of season\" if you loved it?",
      "Thrift flip or designer piece — what are you wearing this weekend?",
    ],
    funny: [
      "My closet is a museum and I'm the only visitor.",
      "I dress like I have somewhere to be and I never do.",
      "My \"I have nothing to wear\" is based on clothes I bought but forgot I owned.",
    ],
  },

  student: {
    key: "student",
    label: "student",
    people: "students",
    aPerson: "a student",
    hashtags: ["#student", "#university", "#study", "#studytips", "#college"],
    situations: [
      "Wrote a 2,000 word essay at 2am. Got an A-. I'll never know what I wrote.",
      "Group project where I did everything and still had to fight for my name on the slides.",
      "The night before the exam when you suddenly remember the whole syllabus exists.",
      "Went to class, sat down, and realized I forgot the entire subject existed.",
      "Coffee at 3pm because I needed energy for the \"quick 10 minute\" task that took 4 hours.",
    ],
    frustrations: [
      "The library \"quiet zone\" where everyone is on a phone call.",
      "A 3-hour lecture in a chair that hates you.",
      "Tuition. Textbooks. Traffic. That's my list.",
      "Past papers with no mark scheme. Pure psychological warfare.",
      "The classmate who answers everything but never shows up to group meetings.",
    ],
    wins: [
      "Finished an assignment two days early. Two days! Never felt so powerful.",
      "Passed the exam I was convinced I failed.",
      "Actually understood the topic in class today instead of nodding along.",
      "Wrote a full draft before the deadline for the first time in my life.",
    ],
    tips: [
      "Study in 25-minute blocks with real breaks. Cramming all night is just stress with extra steps.",
      "Teach it to a friend (or an imaginary one). If you can't explain it, you don't know it.",
      "Do the scary assignment first. Future you will be so grateful.",
      "Sleep before the exam > one more page of notes. Trust the science on this.",
    ],
    hotTakes: [
      "Attendance marks punish people who already know the material.",
      "8am lectures are a human rights violation.",
      "Group projects should be optional.",
      "The best students are the ones who ask the \"dumb\" questions.",
    ],
    questions: [
      "What's your study method nobody believes actually works?",
      "How do you actually study — flashcards, past papers, or pure panic?",
      "What's the class you're secretly worried you're going to fail?",
    ],
    funny: [
      "I don't procrastinate. I just have an optimistic relationship with deadlines.",
      "My GPA is fine. My sleep schedule is not.",
      "I've read the first 3 pages of the textbook 12 times.",
    ],
  },

  "business owner": {
    key: "business",
    label: "business owner",
    people: "business owners",
    aPerson: "someone who owns a business",
    hashtags: ["#smallbusiness", "#entrepreneur", "#businessowner", "#startup", "#solopreneur"],
    situations: [
      "Sent the invoice at 11pm again. The whole \"work-life balance\" thing, I'll try it next quarter.",
      "A client asked to \"pick my brain\" for free. I picked theirs right back — with my rate card.",
      "It's month end. Cash flow is a very dramatic word.",
      "Said \"sure, I'll just do it myself\" to avoid explaining the thing again.",
      "Worked all weekend so I could relax Monday. The relax never came.",
    ],
    frustrations: [
      "The DM that says \"I love your work!\" followed by five paragraphs asking for free stuff.",
      "Business advice from people who have never run a business.",
      "Accounting. The answer is always accounting.",
      "\"Can you do it cheaper?\" after I already gave the discount.",
      "The client who pays two months late and acts surprised at the late fee.",
    ],
    wins: [
      "Got my first repeat client this month. Someone chose me twice. That hit different.",
      "Raised my prices and didn't lose a single client.",
      "Paid myself a salary for the first time. Cried a little. Paid myself again.",
      "Said no to a bad client and somehow the business didn't end.",
      "Hit the number I wrote on my vision board last January.",
    ],
    tips: [
      "Charge for your experience, not your hours. They're paying for the years, not the time.",
      "Put your prices on the website. The clients who can't afford you were never going to be your clients.",
      "Write the invoice before you do the work, not after.",
      "The clients who pay you well are better than the clients who pay you a lot.",
    ],
    hotTakes: [
      "Being \"always available\" isn't a strategy, it's a slow-motion burnout.",
      "If you're not annoying someone, you're probably invisible.",
      "You can raise your prices. The right clients stay.",
      "Small isn't a problem. Invisible is the problem.",
    ],
    questions: [
      "What was your first real \"oh, I'm a business now\" moment?",
      "How do you handle clients who pay late — kindly, or with a smile and a late fee?",
      "What do you wish you knew before you started your business?",
    ],
    funny: [
      "My business card should just say \"fixes things other people couldn't\".",
      "I'm not late, I'm on business owner hours.",
      "I started a business so I could have more time. I was very wrong.",
    ],
  },

  "tech creator": {
    key: "techcreator",
    label: "tech creator",
    people: "tech creators",
    aPerson: "a tech creator",
    hashtags: ["#contentcreator", "#creator", "#viral", "#techcreator", "#newcreator"],
    situations: [
      "Edited for five hours, posted at 9:41pm because the algorithm \"likes it\", got 50 views. Posting at 9:42pm tomorrow. We learn.",
      "The video I threw together in 20 minutes did 10x better than the one I spent three days on. Make it make sense.",
      "Upgraded my setup. Now the content has to match the gear. Pressure.",
      "Filmed 8 takes and still used the outtake.",
      "The trend I ignored blew up two days later. Every single time.",
    ],
    frustrations: [
      "The algorithm changing right after I finally figured it out.",
      "\"I could do that\" in my comments. Okay, king, where's your video?",
      "Exporting a 4K video on a laptop that sounds like a jet engine.",
      "The views being great for a week and then the algorithm forgetting I exist.",
      "Planning a whole week of content and posting exactly one.",
    ],
    wins: [
      "A creator I look up to commented on my video. Framing it, sending it to my mom.",
      "Hit my first 1,000 followers and the last 100 came from one video.",
      "The post I thought would flop carried the whole week.",
      "Someone told me my video actually helped them. That's the whole reason I do this.",
    ],
    tips: [
      "Post the video you're most scared of. Those are the ones that pop off.",
      "The first three seconds decide everything. Cut the intro. Start mid-sentence.",
      "Consistency beats perfection. A mid video every week beats a masterpiece never.",
      "Make the content you'd stop scrolling for. Then it'll make people stop scrolling.",
    ],
    hotTakes: [
      "The algorithm isn't out to get you. You just made a boring video.",
      "You don't need a better camera. You need a better hook.",
      "Views don't mean connection. Comments do.",
    ],
    questions: [
      "What's the post you thought would flop that blew up instead?",
      "How long until you delete your \"why didn't this perform\" drafts? Asking for me.",
      "Do you post what you love or what the algorithm rewards?",
    ],
    funny: [
      "My views are down and my therapist is a comment section.",
      "I know 47 editing shortcuts and I still use the same three.",
      "I'll go viral. Right after I stop second-guessing every post.",
    ],
  },

  "lifestyle creator": {
    key: "lifestyle",
    label: "lifestyle creator",
    people: "lifestyle girlies",
    aPerson: "someone who romanticizes their life",
    hashtags: ["#lifestyle", "#life", "#dayinmylife", "#lifestylecreator"],
    situations: [
      "Planned the \"perfect weekend\" and then slept for 14 hours. No regrets.",
      "Cleaned my whole room so I could film a 30 second video in it. Priorities.",
      "Grocery shopping without a list. It's a lifestyle. It's also a gamble.",
      "Romanticized my morning routine at 6am and was a gremlin by 6pm.",
      "Told myself this year would be different. It's March. Different is pending.",
    ],
    frustrations: [
      "The \"clean with me\" video where I clean my desk and then never clean it again.",
      "Being a main character for one day and a side quest the rest of the week.",
      "My \"reset week\" turning into a reset month.",
    ],
    wins: [
      "Actually followed my morning routine for a whole week. Felt like a main character.",
      "Tried the new recipe and it looked like the picture. Marking this day on the calendar.",
      "Had one genuinely good, simple day. No drama. No plans. Just nice.",
      "Got out of bed on time three days in a row. Celebrating the small stuff.",
    ],
    tips: [
      "A five minute reset beats a perfect routine you'll never stick to.",
      "Do the hard task first thing. Your 3pm self will be so grateful.",
      "Plan one thing a day. Not twelve. One.",
      "Romanticize the boring days. That's where life actually happens.",
    ],
    hotTakes: [
      "Being busy all the time isn't a personality. Rest is productive.",
      "You don't need a \"dream life\". You need a decent Tuesday.",
      "Your routine doesn't have to be aesthetic to count.",
    ],
    questions: [
      "What's your favorite thing about your current life that younger you would be surprised by?",
      "What's your \"reset\" activity when everything feels like too much?",
      "What's one small habit that made your week feel lighter?",
    ],
    funny: [
      "My morning routine takes 4 hours and includes 3 naps.",
      "I romanticize my life so hard that folding laundry is a whole production.",
      "My to-do list is a novel and I'm on chapter one.",
    ],
  },

  fitness: {
    key: "fitness",
    label: "fitness person",
    people: "gym people",
    aPerson: "someone who talks about protein a lot",
    hashtags: ["#fitness", "#gym", "#workout", "#fitnessmotivation"],
    situations: [
      "Skipped the gym for a week, went back today and my legs are filing a complaint.",
      "Tried a new workout, couldn't walk the next day, told everyone I \"trained legs\".",
      "Gym was packed with the resolution crowd. Respect to them. Also, the squat racks are taken.",
      "Said I'd work out at 6am. Set the alarm. Both of us are disappointed.",
    ],
    frustrations: [
      "The gym bro re-racking every dumbbell except the ones he used.",
      "Protein prices. That's it. That's the post.",
      "When someone films their set for two minutes and you're just trying to use the machine.",
    ],
    wins: [
      "Ran 5k without stopping. Three months ago I couldn't run 1.",
      "Hit a new PR and screamed in the gym. Zero regrets.",
      "Went to the gym even though I really didn't want to. That's the workout that counts.",
      "Did a full week of training without missing a day.",
    ],
    tips: [
      "Consistency beats intensity. A walk is better than a skipped workout.",
      "Eat the protein and sleep. The results come from the boring parts.",
      "You don't need a gym to get in shape. You need a plan and a floor.",
      "Show up even when it's mid. The mid sessions are the ones that build the habit.",
    ],
    hotTakes: [
      "You don't need a gym membership to get in shape. You need consistency.",
      "Six packs are made in the kitchen, not the gym. And that's fine.",
      "Motivation is a scam. Discipline is the only thing that works.",
    ],
    questions: [
      "What's the workout you hate but keeps you consistent?",
      "How do you stay on track on the days you just don't want to?",
      "Gym, home, or outdoor — where do you actually train best?",
    ],
    funny: [
      "My gym bag has been packed for 6 days. It's part of the decor now.",
      "I go to the gym for the people watching. The workout is a bonus.",
      "I'm in great shape. The shape is a circle and it's going to the gym next week.",
    ],
  },

  photographer: {
    key: "photographer",
    label: "photographer",
    people: "photographers",
    aPerson: "a photographer",
    hashtags: ["#photography", "#photographer", "#photooftheday"],
    situations: [
      "Took 400 photos at the shoot. The client picked the one I almost didn't take.",
      "Edited a portrait for two hours to make it look \"natural\". The irony.",
      "The weather app promised golden hour. It delivered a thunderstorm.",
      "Shot the whole thing and realized my memory card was almost full the entire time.",
    ],
    frustrations: [
      "Weather apps lying to you on shoot day.",
      "\"You have a camera, can you just shoot my wedding for free?\"",
      "Clients who want the photo \"as is\" but also \"make it pop\".",
    ],
    wins: [
      "Got the shot I've been chasing for months. The one. It exists now.",
      "A stranger asked if my photos were for sale. Best compliment ever.",
      "Shot something in bad light and it still worked. Trusted the craft.",
      "Delivered a gallery the client teared up at.",
    ],
    tips: [
      "Chase light, not gear.",
      "Shoot in the golden hour and edit in the calm.",
      "Take the shot. A mediocre photo you took is better than a perfect one you missed.",
      "Learn to shoot in bad light. Then you're never waiting on the weather.",
    ],
    hotTakes: [
      "Gear doesn't make the photo. The person holding it does.",
      "Over-editing is why nobody trusts photos anymore.",
      "Phone cameras are enough. Go make the work.",
    ],
    questions: [
      "What's the photo you're most proud of that nobody has seen?",
      "Film or digital — and why is the answer personal?",
      "What's a subject you keep coming back to shoot?",
    ],
    funny: [
      "My camera roll is 90% blurry test shots and 10% \"the one\".",
      "I see better in golden hour than I do in my own apartment.",
      "I bring a camera everywhere and still miss every important moment.",
    ],
  },

  food: {
    key: "food",
    label: "food person",
    people: "food people",
    aPerson: "someone who takes pictures of their meals",
    hashtags: ["#food", "#cooking", "#recipe", "#homecooking"],
    situations: [
      "Followed a recipe, had 47 tabs open, and still didn't have the right pan.",
      "Cooked for the first time in weeks and it felt like a personality trait.",
      "Made a dish and it looked nothing like the photo. Tasted great though, and that's all that matters.",
      "My \"quick snack\" turned into a two hour cooking project.",
    ],
    frustrations: [
      "The recipe says \"season to taste\". Taste for what??",
      "Restaurant meals that could have been better than my leftovers. They weren't.",
      "When the food video looks 10x better than the actual food.",
    ],
    wins: [
      "Made the recipe again and it actually looked like the photo this time.",
      "My rice finally came out fluffy. I'm so serious, this is big.",
      "Cooked a full meal without checking my phone once. Zone of focus.",
      "The bread rose. The bread ROSE.",
    ],
    tips: [
      "Mise en place. Prep everything first and cooking feels like a cheat code.",
      "Taste as you go. That's the whole secret.",
      "Salt things in layers, not all at the end.",
      "The pan needs to be hot before the food goes in. Trust it.",
    ],
    hotTakes: [
      "Garlic measurements in recipes are cowardly.",
      "Breakfast for dinner is the best meal of the week.",
      "A one-pot meal beats a 47-ingredient masterpiece on a Tuesday.",
    ],
    questions: [
      "What's your \"safe meal\" you make when you can't decide?",
      "What's a dish you finally mastered after years of failing?",
      "Sweet or savory breakfast? There's one right answer.",
    ],
    funny: [
      "I follow recipes like guidelines and it shows.",
      "My kitchen has one (1) good pot and it's been on the stove for days.",
      "I'll be healthy tomorrow. Tonight, I'm ordering.",
    ],
  },

  artist: {
    key: "artist",
    label: "artist",
    people: "artists",
    aPerson: "an artist",
    hashtags: ["#art", "#artist", "#drawing", "#creative"],
    situations: [
      "Worked on a piece for six hours, hated it, flipped it over. Loved the back.",
      "The piece I rushed in an hour got more love than the one I worked on for a month.",
      "The creative block that hits the day before a deadline. Every single time.",
      "Started a piece with no plan and it's somehow the best thing I've made.",
    ],
    frustrations: [
      "People asking if you can \"just draw them something for free\".",
      "The blank canvas stare that lasts three hours.",
      "Comparing your work to someone who's been at it for twenty years.",
    ],
    wins: [
      "Finished the piece that's been staring at me for weeks. It finally feels done.",
      "Saw someone genuinely moved by my work. That's the whole reason.",
      "The piece I doubted became my favorite. Proving me wrong is my specialty.",
      "Someone commissioned me. Someone paid for my art. We're in business.",
    ],
    tips: [
      "Make bad art on purpose. The good stuff comes after the bad stuff gets out.",
      "Compare your work to your old work, not other people's.",
      "Show up even on the uninspired days. The muse respects attendance.",
      "Don't wait for the mood. Start and the mood finds you.",
    ],
    hotTakes: [
      "AI art is a tool, not an artist. Sorry.",
      "You don't need a \"style\". You need to make a lot of work.",
      "Every masterpiece starts as a draft nobody should see.",
    ],
    questions: [
      "What's the piece you made that nobody gets but you love?",
      "Do you show your work in progress or keep it a secret until it's done?",
      "What's your favorite thing you've ever made?",
    ],
    funny: [
      "My \"art studio\" is a corner of my room and a lot of denial.",
      "The amount of unfinished sketches I have is an art form in itself.",
      "I'm very good at starting projects. Finishing them is a newer hobby.",
    ],
  },

  gamer: {
    key: "gamer",
    label: "gamer",
    people: "gamers",
    aPerson: "a gamer",
    hashtags: ["#gaming", "#gamer", "#videogames"],
    situations: [
      "Lost a ranked match at 3am and now I'm researching strategies I'll never use.",
      "The teammate who \"has a mic\" but has never spoken a single word.",
      "Was winning, heard the doorbell, paused, got destroyed. Real life is the final boss.",
      "Opened the game \"just to check\" at 10pm and it's 3am now.",
    ],
    frustrations: [
      "Lag spikes at the exact worst moment. Every single time.",
      "The game updated and now all my old strats are dead.",
      "Matchmaking putting me against people who clearly don't sleep.",
    ],
    wins: [
      "Finally got the rank I've been grinding for. Felt like winning a championship.",
      "Pulled off the play I've been practicing for weeks. Clipped it. Watched it ten times.",
      "Carried the whole team without saying a word. Pure silence, pure dominance.",
      "Finished the game I've been meaning to play for two years.",
    ],
    tips: [
      "Take a break after two losses. Tilt is a real stat.",
      "Warm up before ranked. Your aim is cold too.",
      "Turn off chat if it tilts you. The wins will go up.",
    ],
    hotTakes: [
      "Battle passes are just FOMO with a price tag.",
      "K/D doesn't matter if you're not having fun.",
      "Single-player > everything. Some of us like a good story.",
    ],
    questions: [
      "What game do you keep coming back to no matter what?",
      "Ranked or casual, and why is the answer \"it depends on my mood\"?",
      "What's your most played game and do you even like it anymore?",
    ],
    funny: [
      "My win rate is fine. My emotional stability is the issue.",
      "I don't rage quit. I \"strategically log off\".",
      "I've lost to beginners and I will take that to my grave.",
    ],
  },

  marketer: {
    key: "marketer",
    label: "marketer",
    people: "marketers",
    aPerson: "a marketer",
    hashtags: ["#marketing", "#marketingtips", "#digitalmarketing"],
    situations: [
      "Made a 3-month content plan. Deleted it after week one because \"the numbers said otherwise\".",
      "Wrote ten hooks. The client picked the one I put in as a joke.",
      "A campaign I was sure would flop quietly outperformed the \"safe\" one. Screenshots taken.",
      "Spent an hour on an email subject line. The winner was my first draft.",
    ],
    frustrations: [
      "\"We need to go viral\" as a strategy. Cool, I'll just do that.",
      "Reports that take three hours to make and three seconds to read.",
      "The stakeholder who suggests the thing you tested last quarter.",
    ],
    wins: [
      "The campaign I quietly believed in outperformed the \"safe\" one.",
      "A client told me my last report was actually useful. Framing it.",
      "Turned a boring product into a story people actually shared.",
      "The retention number went up. That's the one that pays the bills.",
    ],
    tips: [
      "If it doesn't hook in three seconds, it doesn't exist. Cut harder.",
      "Steal structure, not content. How they hooked you matters more than what they said.",
      "Speak like a human, not a brand. Nobody wants a brochure.",
      "Test one variable at a time. Otherwise you'll never know what worked.",
    ],
    hotTakes: [
      "Vanity metrics are a lie. Comments beat likes.",
      "You don't need to be on every platform. You need to be great on one.",
      "If everyone's going viral with the same trend, it's not strategy anymore.",
    ],
    questions: [
      "What's a \"bad\" post that ended up being your best performer?",
      "Do you A/B test everything or trust your gut?",
      "What metric do you actually optimize for, versus the one you report?",
    ],
    funny: [
      "My job is convincing people the thing they want is the thing they need. It's mostly copywriting.",
      "I've optimized everything except my own sleep schedule.",
      "I can make anything sound exciting. Including a spreadsheet.",
    ],
  },

  designer: {
    key: "designer",
    label: "designer",
    people: "designers",
    aPerson: "a designer",
    hashtags: ["#design", "#designer", "#graphicdesign", "#branding"],
    situations: [
      "The client said \"make it pop\" and I've been staring at the screen for an hour.",
      "Delivered five options. They chose the first one. They always choose the first one.",
      "A 2px spacing change. A two hour discussion. The life of a designer.",
      "Designed for three hours and the final version looks almost identical to the first.",
    ],
    frustrations: [
      "\"Can we just make the logo bigger?\" Sure, and also your requests.",
      "Font choice arguments that have gone on for weeks.",
      "The template everyone uses being called \"your design\".",
    ],
    wins: [
      "The design I fought for got approved and it's the best thing I've made.",
      "Someone asked me to teach them how I did it. Best feeling ever.",
      "The client came back asking for \"more of the same\" — the highest praise.",
      "Finalized a project with zero revisions. It happened. It was real.",
    ],
    tips: [
      "White space isn't wasted space. It's the design.",
      "Steal from the masters, not the templates.",
      "Solve the problem first. Pretty comes second.",
      "Show your work to people who'll be honest, not just people who'll be nice.",
    ],
    hotTakes: [
      "Your portfolio doesn't need 20 projects. It needs five great ones.",
      "If it looks like a template, it is a template.",
      "Good design is invisible. Great design is noticed.",
    ],
    questions: [
      "What design trend are you tired of seeing everywhere?",
      "What's the project you're actually proud of?",
      "Client-pleaser or follow-your-taste — which one wins for you?",
    ],
    funny: [
      "I have 47 tabs open and half are \"logo inspiration\". The other half are also logo inspiration.",
      "I don't have a \"type\". Unless we're talking about fonts. I have types.",
      "My signature move is moving something 2px and calling it a new concept.",
    ],
  },

  writer: {
    key: "writer",
    label: "writer",
    people: "writers",
    aPerson: "a writer",
    hashtags: ["#writing", "#writer", "#amwriting"],
    situations: [
      "Opened a blank document at 9am. Closed it at 9:04. Opened it at 11pm. Wrote 2,000 words.",
      "The sentence I reworked 12 times that ended up exactly like the first version.",
      "Got an idea in the shower, forgot it by the time I dried off.",
      "Wrote the ending before the beginning. Now I have to write the beginning knowing the ending.",
    ],
    frustrations: [
      "\"You should write about me someday!\" — every conversation I've ever had.",
      "Writer's block that feels like a full-time job.",
      "The word count I planned vs the word count I actually produced.",
    ],
    wins: [
      "A reader told me my words got them through something. Cried a little. Wrote more.",
      "Finished the draft. The first draft of anything is a miracle.",
      "Wrote every day for a whole week. The streak is the story.",
      "Got paid to write. Someone paid me for my words. Pinch me.",
    ],
    tips: [
      "Write badly on purpose. Editing is where it becomes good.",
      "Read everything. Your taste grows from what you consume.",
      "Set a timer and write for fifteen minutes. Deadlines beat motivation.",
      "The first sentence is the hardest. Write the second one first.",
    ],
    hotTakes: [
      "AI can write faster. It can't feel.",
      "The \"perfect\" first sentence is a myth. Write the sentence, find the hook later.",
      "You don't need inspiration. You need a deadline and a habit.",
    ],
    questions: [
      "What's the piece of writing that changed how you see things?",
      "Do you plot everything or make it up as you go?",
      "What do you write when you have no idea what to write?",
    ],
    funny: [
      "I write 500 words and call it a day. I think about writing the other 23 hours.",
      "My favorite character is the one I keep meaning to write about.",
      "I'm not blocked. I'm \"researching\" by staring at the ceiling.",
    ],
  },

  musician: {
    key: "musician",
    label: "musician",
    people: "musicians",
    aPerson: "a musician",
    hashtags: ["#music", "#musician", "#songwriter"],
    situations: [
      "Recorded a demo in my bedroom and it somehow sounds better than the studio version.",
      "The song I wrote in ten minutes is the one everyone loves.",
      "Had a melody stuck in my head, hummed it into my phone, and it's the best idea I've had in months.",
      "Practiced for an hour, nailed the part, and then couldn't do it again for a week.",
    ],
    frustrations: [
      "\"You can play that thing in the corner?\" Yes. It's called a guitar.",
      "The creative dry spell right before the gig I've been prepping for.",
      "Recording vocals when the neighbors decide to start renovating.",
    ],
    wins: [
      "Played my own song to a live crowd and heard people singing it back. Unreal.",
      "Finished the track after weeks of \"almost done\".",
      "The chord I was afraid to try became my favorite one.",
      "Someone told me my song got them through a breakup. Music works, y'all.",
    ],
    tips: [
      "Practice the boring parts. The fun parts take care of themselves.",
      "Write the bad songs. You need them to get to the good ones.",
      "Record every idea. The ones you forget are the ones you miss.",
      "Learn the theory, then forget it on stage.",
    ],
    hotTakes: [
      "You don't need a label. You need a following that trusts you.",
      "Autotune is a tool. Your tone is still the instrument.",
      "Playing covers forever is a great way to never be a musician.",
    ],
    questions: [
      "What song do you never get tired of playing?",
      "Do you write lyrics first or music first?",
      "What's the song that made you want to make music?",
    ],
    funny: [
      "My neighbors have heard every version of this chorus. We're basically collaborators now.",
      "I've been \"almost done\" with this track for six months.",
      "I write love songs and I haven't left my room in weeks.",
    ],
  },

  travel: {
    key: "travel",
    label: "traveler",
    people: "travelers",
    aPerson: "a traveler",
    hashtags: ["#travel", "#traveldiary", "#wanderlust"],
    situations: [
      "Missed my flight by four minutes and it ended up being the best day of the trip.",
      "The \"hidden gem\" restaurant was behind a gas station. Best meal of my life.",
      "Got lost in a city with no signal and found the whole point of the trip.",
      "Planned every hour, then slept through the first one. The best trips are the unplanned parts.",
    ],
    frustrations: [
      "Packing for three weeks in a carry-on. It's a skill. It's also a struggle.",
      "The wifi at the \"digital nomad paradise\" working exactly once.",
      "The tourist spot that looks nothing like the photo.",
    ],
    wins: [
      "Navigated a foreign city without a map. Felt like a local. Was not a local.",
      "Saw the sunrise at the spot everyone says to see. Worth the 4am alarm.",
      "Ate the weird thing on the menu and it was incredible.",
      "Made friends with strangers in a hostel and kept in touch. The real souvenir.",
    ],
    tips: [
      "Pack half the clothes and double the money.",
      "Leave gaps in the itinerary. The best moments are unplanned.",
      "Stay somewhere with a kitchen. You'll eat better and save a fortune.",
      "Book the first night, wing the rest. You'll figure it out.",
    ],
    hotTakes: [
      "Oversharing every meal isn't traveling, it's an album.",
      "Hostels beat hotels for solo travel. The stories are better.",
      "The journey matters more than the destination. And the people matter most.",
    ],
    questions: [
      "What's the place that looked amazing online but disappointed in person?",
      "What's your best \"we almost didn't go\" story?",
      "Travel to relax or travel to explore — which one are you?",
    ],
    funny: [
      "I go on vacation to \"rest\" and come back needing a vacation.",
      "My itinerary is a list of restaurants with one museum attached.",
      "I packed for every weather and only got one.",
    ],
  },

  "health and wellness": {
    key: "health",
    label: "wellness person",
    people: "wellness people",
    aPerson: "someone who prioritizes rest",
    hashtags: ["#wellness", "#selfcare", "#health"],
    situations: [
      "Slept nine hours for the first time in months and woke up like a new person.",
      "Told my doctor the truth about my diet. We're both in shock.",
      "Said no to something to protect my energy. Felt like a rebellion.",
      "Meditated for five minutes and felt like a guru.",
    ],
    frustrations: [
      "Wellness advice from people selling detox teas.",
      "The \"just try harder\" advice. Like I hadn't thought of that.",
      "Self-care that costs $200 and comes in a subscription box.",
    ],
    wins: [
      "Went a whole month without a stress migraine. Miracle.",
      "Said no to something to protect my energy. Felt like a rebellion.",
      "Went to bed before midnight three nights in a row.",
      "Actually rested on my day off instead of \"doing\" resting.",
    ],
    tips: [
      "Sleep isn't a luxury. It's the foundation everything else sits on.",
      "Move your body daily. Even ten minutes counts.",
      "Boundaries are self-care. No is a full sentence.",
      "Hydrate, move, sleep. The boring stuff is the magic stuff.",
    ],
    hotTakes: [
      "Toxic positivity is just negativity with a smiley face.",
      "Being busy isn't a badge of honor. It's a symptom.",
      "Rest is productive. I'll say it again for the people in the back.",
    ],
    questions: [
      "What small habit made the biggest difference to your health?",
      "How do you actually rest — not just \"stop working\"?",
      "What does your version of self-care actually look like?",
    ],
    funny: [
      "My self-care is a nap and a good snack. The experts call it \"nourishment\".",
      "I meditated for five minutes and felt like I'd been to a retreat.",
      "My boundaries are solid until someone offers me free food.",
    ],
  },

  beauty: {
    key: "beauty",
    label: "beauty person",
    people: "beauty people",
    aPerson: "someone with a very full makeup bag",
    hashtags: ["#beauty", "#makeup", "#skincare"],
    situations: [
      "Followed the tutorial exactly. Looked like the tutorial. Still in shock.",
      "Tried a new foundation and it matched. It MATCHED. I called my mom.",
      "Spent 45 minutes on my makeup to sit at home. It's called art.",
      "The \"5 minute makeup\" routine that takes an hour.",
    ],
    frustrations: [
      "\"You look tired!\" No. I just don't have makeup on.",
      "Products that look nothing like the ad. As usual.",
      "Buying the full size before trying the mini and regretting it.",
    ],
    wins: [
      "Got my brows right on the first try. First try!",
      "The look I tried \"for fun\" became my signature.",
      "Followed a tutorial and it actually worked. A miracle.",
      "Finished a product. Actually finished one. There's proof of consistency.",
    ],
    tips: [
      "Your skin routine matters more than your foundation. Trust the process.",
      "Buy minis first. No one needs a full size they'll hate.",
      "Patch test. Patch test. Patch test.",
      "Skincare is a habit, not a weekend hobby.",
    ],
    hotTakes: [
      "\"Clean girl\" is just skincare with good lighting.",
      "Makeup isn't about covering up. It's about having fun.",
      "You don't need a 12-step routine. You need sunscreen.",
    ],
    questions: [
      "What product would you repurchase forever?",
      "What's a trend you tried and immediately regretted?",
      "Glowy skin or full glam — what's your everyday?",
    ],
    funny: [
      "I have one signature look and 40 products that could never.",
      "My \"natural makeup\" look uses five different products.",
      "I'm one skincare step away from a full lab in my bathroom.",
    ],
  },
};

const genericProfile = {
  key: "creator",
  label: "creator",
  people: "creators",
  aPerson: "a creator",
  hashtags: ["#creator", "#creating"],
  situations: [
    "The moment something finally clicks after weeks of feeling stuck.",
    "Started a new project and immediately realized it's way bigger than I thought.",
    "The \"one more thing\" that turns a ten minute task into a three hour one.",
    "Woke up excited about the idea, and by lunch I'd talked myself out of it. By dinner I was back in.",
  ],
  frustrations: [
    "Explaining what I do at family dinners.",
    "When the thing I'm working on just... doesn't work.",
    "The tiny detail nobody else would notice that's consuming my whole day.",
  ],
  wins: [
    "The project I've been avoiding is finally done.",
    "Someone asked me how I do what I do. Felt good.",
    "Showed up even when I didn't feel like it. That's the real win.",
    "Got a little better today than yesterday. That's the whole game.",
  ],
  tips: [
    "Show up when you don't feel like it. That's when it counts.",
    "Break the big scary thing into tiny boring steps.",
    "Done is better than perfect. Ship it.",
    "The version you'd enjoy is the version people respond to.",
  ],
  hotTakes: [
    "You don't need permission to start. You just need to start.",
    "Talent is overrated. Reps are underrated.",
    "The best time was yesterday. The second best time is today.",
  ],
  questions: [
    "What's the thing you keep putting off?",
    "What's your best \"it finally worked\" moment?",
    "What's one thing you'd start today if you knew it couldn't fail?",
  ],
  funny: [
    "My to-do list is a novel.",
    "I have \"just one more thing\" disease.",
    "My biggest flex is starting something and actually finishing it.",
  ],
};

const NICHE_KEYS = Object.keys(profiles);

function resolveProfile(nicheRaw = "") {
  const n = nicheRaw.toLowerCase().trim();
  const match = (tags, key) => tags.some((t) => n.includes(t));
  if (match(["lifestyle", "vlog", "daily life", "day in my life"], "lifestyle creator")) return profiles["lifestyle creator"];
  if (match(["web", "dev", "code", "program", "frontend", "backend", "software"], "web developer")) return profiles["web developer"];
  if (match(["fashion", "style", "outfit", "clothing", "wardrobe", "fit check"], "fashion creator")) return profiles["fashion creator"];
  if (match(["student", "uni", "college", "school", "exam", "degree"], "student")) return profiles.student;
  if (match(["business", "entrepreneur", "owner", "startup", "agency", "coach", "solo"], "business owner")) return profiles["business owner"];
  if (match(["tech creator", "tech"], "tech creator")) return profiles["tech creator"];
  if (match(["fit", "gym", "workout", "training", "health club"], "fitness")) return profiles.fitness;
  if (match(["photo", "camera", "filmmak"], "photographer")) return profiles.photographer;
  if (match(["food", "cook", "chef", "baker", "recipe", "kitchen"], "food")) return profiles.food;
  if (match(["art", "artist", "illustrat", "draw", "paint"], "artist")) return profiles.artist;
  if (match(["gam", "esport"], "gamer")) return profiles.gamer;
  if (match(["market", "seo", "social media manag", "growth"], "marketer")) return profiles.marketer;
  if (match(["design", "ux", "ui", "branding"], "designer")) return profiles.designer;
  if (match(["writer", "author", "blog", "copywrit", "poetry"], "writer")) return profiles.writer;
  if (match(["music", "musician", "producer", "sing"], "musician")) return profiles.musician;
  if (match(["travel", "wander", "nomad"], "travel")) return profiles.travel;
  if (match(["health", "wellness", "mental", "meditat", "selfcare", "self care"], "health and wellness")) return profiles["health and wellness"];
  if (match(["beauty", "makeup", "skincare", "hair", "cosmetic"], "beauty")) return profiles.beauty;

  if (n && n.length > 1) {
    return {
      ...genericProfile,
      key: slug(n) || "creator",
      label: n,
      people: `${n} community`,
      aPerson: `a ${n}`,
      hashtags: [`#${slug(n)}`, ...genericProfile.hashtags],
    };
  }
  return genericProfile;
}

// ---------------------------------------------------------------------------
// Hooks, CTAs, tags
// ---------------------------------------------------------------------------

const HOOK_BANKS = {
  story: [
    "Nobody warned me about this.",
    "I learned this the hard way.",
    "I almost didn't share this.",
    "Okay, this is a little embarrassing but...",
    "Let me tell you a story.",
    "This happened to me the other day and I'm still processing it.",
    "I keep thinking about the time...",
  ],
  confession: [
    "I need to be honest about something.",
    "Unpopular opinion:",
    "Can we talk about this?",
    "I've been sitting on this take for a while.",
    "Okay I'll say it.",
  ],
  curiosity: [
    "This might sound crazy, but...",
    "I wish I knew this six months ago.",
    "Here's something I wish someone told me earlier.",
    "Can we just admit...",
    "Nobody tells you about this part.",
    "The thing they don't put on the course description:",
    "Hot take incoming:",
  ],
  pov: [
    "POV:",
    "The funniest thing about being a {people}...",
    "The truth about being a {people}:",
    "Being a {aPerson} is...",
  ],
};

const CTAS = [
  "Has this happened to you too?",
  "Which one are you?",
  "Be honest 😂",
  "Would you try this?",
  "What's your experience with this?",
  "Am I the only one?",
  "Drop your take below.",
  "Save this for later.",
  "Tell me your version in the comments.",
  "Sound off in the comments — I actually read them.",
  "Tag the person who needs to see this.",
  "Have you ever felt this? Be honest.",
  "What would you add?",
  "Let's talk about it in the comments.",
];

const NO_CTA = "__none__";

const BANNED_PHRASES = [
  "in today's digital world",
  "in today's fast-paced world",
  "unlock your potential",
  "5 powerful tips",
  "5 powerful tips",
  "like, comment and share",
  "don't forget to like",
  "success doesn't happen overnight",
  "your journey starts today",
  "embrace the journey",
  "believe in yourself and keep pushing",
  "the journey of a thousand miles",
  "think outside the box",
  "game changer",
  "empower your",
  "level up your",
  "skyrocket",
  "10x your",
  "you've got this keep going",
];

function containsBanned(text = "") {
  const t = text.toLowerCase();
  return BANNED_PHRASES.some((p) => t.includes(p));
}

// ---------------------------------------------------------------------------
// Content types
// ---------------------------------------------------------------------------

export const CONTENT_TYPES = [
  { value: "auto", label: "Auto mix" },
  { value: "storytelling", label: "Storytelling" },
  { value: "personal", label: "Personal experience" },
  { value: "educational", label: "Educational" },
  { value: "opinion", label: "Opinion" },
  { value: "relatable", label: "Relatable" },
  { value: "funny", label: "Funny" },
  { value: "bts", label: "Behind the scenes" },
  { value: "hotTake", label: "Hot take" },
  { value: "question", label: "Question" },
  { value: "promo", label: "Promotional" },
  { value: "achievement", label: "Achievement" },
  { value: "eduPersonal", label: "Educational + personal" },
];

const TYPE_LABELS = Object.fromEntries(
  CONTENT_TYPES.filter((t) => t.value !== "auto").map((t) => [t.value, t.label])
);

// The example mix when generating several posts at once.
const AUTO_MIX = [
  "storytelling",
  "question",
  "hotTake",
  "educational",
  "funny",
  "personal",
  "bts",
  "opinion",
  "relatable",
  "achievement",
];

// ---------------------------------------------------------------------------
// Context builder + templates
// ---------------------------------------------------------------------------

function buildContext(rng, input, profile, used) {
  const topic = (input.topic || "").trim();
  const ctx = {
    rng,
    input,
    profile,
    topic,
    hasTopic: topic.length > 0,
    // topic-aware opening filler
    opener: topic
      ? pick(rng, [`So let's actually talk about ${topic}.`, `I've got thoughts on ${topic} and I need to get them out.`, `Okay, ${topic}. Let's go there.`, `Real talk about ${topic}.`])
      : "",
  };
  return ctx;
}

// Each type is a list of template functions returning { hook?, lines[], cta? }
const TYPES = {
  storytelling: [
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, HOOK_BANKS.story),
        lines: [
          c.hasTopic ? `The other day I was thinking about ${c.topic}, and it took me back to a real moment.` : s,
          c.hasTopic ? `Here's how it went — it didn't go how I planned at all.` : `Here's how it went — it did not go how I planned.`,
          pick(c.rng, [`I handled it badly at first, then figured it out the slow way.`, `Turns out the messiest moments make the best stories.`, `I nearly quit. I'm glad I didn't.`]),
          pick(c.rng, [`Ended up teaching me more than the easy version ever would.`, `Now it's one of those stories I laugh about — because I survived it.`]),
        ],
        cta: c.rng() < 0.5 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, ["So here's how it went:", "Okay, story time.", "I'll make this quick."]),
        lines: [
          c.hasTopic ? `It started because of ${c.topic}.` : s,
          pick(c.rng, [`Then one thing led to another. And by \"another\" I mean a whole situation.`, `And of course, it happened at the worst possible time.`]),
          pick(c.rng, [`The ending? Not what I expected. Better, honestly.`, `I look back on it now and just laugh.`, `The whole thing was a mess, but it worked out.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, ["I almost didn't post this.", "I was going to keep this to myself, but here we are."]),
        lines: [
          c.hasTopic ? `You know ${c.topic}? Yeah. That's where this starts.` : s,
          pick(c.rng, [`It felt like everything was against me that day.`, `The plan was simple. The execution was not.`, `Nothing was going right and I was this close to giving up.`]),
          pick(c.rng, [`I pushed through anyway, and I'm actually glad I did.`, `Something shifted when I stopped trying so hard.`, `It worked out in the weirdest way possible.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, ["Story time — no skips.", "This one's got a little journey to it."]),
        lines: [
          c.hasTopic ? `So, ${c.topic}. I have a story about that.` : s,
          `1) I had a plan.`,
          `2) The plan had other ideas.`,
          `3) I adapted. Barely.`,
          pick(c.rng, [`End result? I'd do it again.`, `And now it's a story I actually love telling.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
  ],

  personal: [
    (c) => ({
      hook: pick(c.rng, HOOK_BANKS.confession),
      lines: [
        c.hasTopic ? `I used to feel a certain way about ${c.topic}, and I want to share why.` : `I almost gave up on this not too long ago.`,
        pick(c.rng, [`It wasn't one big thing. It was a thousand small ones.`, `I kept showing up even when I felt like it didn't matter.`, `I told myself \"one more try\" more times than I can count.`]),
        pick(c.rng, [`And then, slowly, something started to click.`, `And eventually the small wins started stacking up.`]),
        pick(c.rng, [`If it's not working yet, that doesn't mean it never will.`, `I'm glad I didn't quit when I wanted to.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, ["I did something I was scared to do.", "Sharing this because it happened to me."]),
        lines: [
          c.hasTopic ? `It involved ${c.topic}, which I'd been avoiding for a while.` : s,
          pick(c.rng, [`My heart was racing the whole time.`, `I almost talked myself out of it at the last second.`]),
          pick(c.rng, [`Turns out the scary thing wasn't that scary once I started.`, `And now that it's done, I feel weirdly proud.`]),
          pick(c.rng, [`I'd do it again. Next time, sooner.`, `That's the kind of moment I want more of.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["I've been thinking about this a lot lately.", "A small thing that happened to me recently."]),
      lines: [
        c.hasTopic ? `There's something about ${c.topic} that's been on my mind.` : `The other day something small happened and it stuck with me.`,
        pick(c.rng, [`It wasn't dramatic. It was just... a moment.`, `Nothing crazy. Just a quiet little thing.`]),
        pick(c.rng, [`But it reminded me why I started.`, `And it made me appreciate where I am now.`, `It made the last few hard weeks feel worth it.`]),
        c.rng() < 0.4 ? pick(c.rng, [`So I'm sharing it. Maybe it lands with you too.`, `Just wanted to put it out there.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.3 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => {
      const f = pick(c.rng, c.profile.frustrations);
      return {
        hook: pick(c.rng, ["I was so frustrated the other day.", "Okay, I need to rant for a second."]),
        lines: [
          c.hasTopic ? `${c.topic} was testing my patience, and I had zero left.` : f,
          pick(c.rng, [`I wanted to give up right there.`, `I stared at it for a solid ten minutes just... frustrated.`]),
          pick(c.rng, [`I stepped away, took a breath, came back.`, `And eventually I figured it out. The slow, annoying way.`]),
          `Anyway. That's the story of how I survived it.`,
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
  ],

  educational: [
    (c) => ({
      hook: pick(c.rng, ["Here's how I'd explain this to a friend.", "A little lesson that took me too long to learn."]),
      lines: [
        c.hasTopic ? `About ${c.topic} — the way it actually works, not the complicated version.` : pick(c.rng, c.profile.tips),
        pick(c.rng, [`I used to overcomplicate this. The simpler version is better.`, `The mistake most people make is trying to do too much at once.`]),
        pick(c.rng, [`Start small. You can't build everything on day one.`, `The boring, consistent way beats the flashy, one-time way.`, `It's not about knowing everything. It's about knowing the next step.`]),
        c.rng() < 0.5 ? pick(c.rng, [`Save this so you don't have to relearn it.`, `Honestly, if someone told me this sooner, I'd have saved so much time.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.5 ? pick(c.rng, ["Save this for later.", "Did this help? Tell me what clicked."]) : NO_CTA,
    }),
    (c) => {
      const t = pick(c.rng, c.profile.tips);
      return {
        hook: pick(c.rng, ["This one tip changed how I work.", "Here's the thing I wish I'd learned way earlier."]),
        lines: [
          c.hasTopic ? `If you're getting into ${c.topic}, start here.` : t,
          pick(c.rng, [`I did it the hard way so you don't have to.`, `Took me months to figure out what I can tell you in one post.`]),
          c.rng() < 0.4 ? pick(c.rng, [`It's not glamorous. It just works.`, `It's simple, which is exactly why it works.`]) : null,
        ].filter(Boolean),
        cta: c.rng() < 0.5 ? pick(c.rng, ["Save this for later.", "Anyone else learned this the hard way?"]) : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["The mistake everyone makes with this.", "Nobody talks about this part, so here it is."]),
      lines: [
        c.hasTopic ? `When it comes to ${c.topic}, everyone focuses on the wrong thing.` : `Most people start the wrong way.`,
        pick(c.rng, [`They skip the foundation and wonder why it falls apart.`, `They copy the visible part and miss the part that actually matters.`]),
        pick(c.rng, [`The real trick is the boring groundwork nobody posts about.`, `Once you fix the foundation, everything else gets easier.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["A quick thing worth knowing.", "If you're starting out, read this."]),
      lines: [
        c.hasTopic ? `For ${c.topic}: progress comes from showing up more than from talent.` : pick(c.rng, c.profile.tips),
        pick(c.rng, [`Nobody is naturally amazing at this. Everyone started somewhere bad.`, `The people who win are the ones who kept going on the boring days.`]),
        c.rng() < 0.5 ? pick(c.rng, [`So if you're early, you're exactly where you need to be.`, `You're closer than you think. Keep going.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
  ],

  opinion: [
    (c) => ({
      hook: pick(c.rng, ["Unpopular opinion:", "I might get roasted for this, but"]),
      lines: [
        c.hasTopic ? `I don't care what everyone says about ${c.topic}. I stand by this.` : pick(c.rng, c.profile.hotTakes),
        pick(c.rng, [`I've thought about this a lot, and I'm not changing my mind.`, `Everyone acts like this is obvious, but I think the opposite.`]),
        pick(c.rng, [`And honestly, I think more people agree than admit it.`, `I said what I said.`, `Come at me in the comments, I can take it.`]),
      ],
      cta: c.rng() < 0.5 ? pick(c.rng, ["Agree or disagree? Be honest.", "Tell me I'm wrong in the comments."]) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["Can we admit something?", "I've been sitting on this take."]),
      lines: [
        c.hasTopic ? `About ${c.topic}: we overcomplicate it, and it's hurting us.` : pick(c.rng, c.profile.hotTakes),
        pick(c.rng, [`It's easier to admit once you've been on both sides.`, `I used to think the opposite. Experience changed my mind.`]),
        pick(c.rng, [`I'm curious what you think, honestly.`, `This one's worth a real conversation.`]),
      ],
      cta: c.rng() < 0.5 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["Hot take:", "Okay, this might annoy some people."]),
      lines: [
        c.hasTopic ? `Here's my honest take on ${c.topic}.` : pick(c.rng, c.profile.hotTakes),
        pick(c.rng, [`I know it's not the popular opinion.`, `Everyone does the safe thing and I think that's a mistake.`]),
        pick(c.rng, [`I'd rather say the real thing than the easy thing.`, `Respectfully, I think most people have this backwards.`]),
      ],
      cta: c.rng() < 0.5 ? pick(c.rng, ["Respectfully disagree? Let's talk.", "Drop your take below."]) : NO_CTA,
    }),
  ],

  relatable: [
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: "Nobody:",
        lines: [
          `Me: *${s}*`,
          c.rng() < 0.4 ? pick(c.rng, ["And I'd do it again. Every time.", "It's the most predictable thing about me."]) : null,
        ].filter(Boolean),
        cta: c.rng() < 0.5 ? pick(c.rng, ["Tag someone who does this too.", "Am I the only one?", "Be honest 😂"]) : NO_CTA,
      };
    },
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: `The most relatable thing about being ${c.profile.aPerson}:`,
        lines: [
          c.hasTopic ? `With ${c.topic}, it always goes like this:` : s,
          pick(c.rng, [`You see it coming. You do it anyway.`, `Every single time, and I still don't learn.`, `You'd think we'd learn. We don't.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, ["Which one are you?", "We're all the same, huh?", "Be honest."]) : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["We all do this and it's fine.", "The little things nobody talks about."]),
      lines: [
        c.hasTopic ? `There's a version of ${c.topic} we all recognize.` : pick(c.rng, c.profile.situations),
        pick(c.rng, [`It's small, but it's so real.`, `It happens to everyone, but nobody mentions it.`]),
        c.rng() < 0.4 ? pick(c.rng, [`Anyway, that's normal, right? Right??`, `I'm choosing to believe this is a universal experience.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.5 ? pick(c.rng, ["Has this happened to you too?", "Am I the only one?"]) : NO_CTA,
    }),
  ],

  funny: [
    (c) => {
      const f = pick(c.rng, c.profile.funny);
      return {
        hook: `The funniest thing about being ${c.profile.aPerson}:`,
        lines: [
          c.hasTopic ? `People think ${c.topic} is all serious. It is not.` : f,
          pick(c.rng, [`We take ourselves way too seriously and it's hilarious.`, `It's a whole personality and I'm not ashamed.`, `The drama is always more ridiculous than the actual work.`]),
          c.rng() < 0.4 ? pick(c.rng, [`Anyway, that's my Ted talk.`, `This is the content nobody asked for but everyone needs.`]) : null,
        ].filter(Boolean),
        cta: c.rng() < 0.4 ? pick(c.rng, ["Be honest, is this you too?", "Tag someone who gets it."]) : NO_CTA,
      };
    },
    (c) => {
      const s = pick(c.rng, c.profile.situations);
      return {
        hook: pick(c.rng, ["Okay but this is actually funny.", "I laughed, I cried, I retold it to everyone."]),
        lines: [
          c.hasTopic ? `Yesterday was a whole ${c.topic} situation.` : s,
          pick(c.rng, [`The universe really has a sense of humor.`, `You can't make this stuff up.`, `My life is a comedy and I'm the main character.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, ["Tell me this happens to you too.", "Rating my luck: hilarious."]) : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["My life in one image:", "A very accurate representation:"]),
      lines: [
        c.hasTopic ? `That's basically ${c.topic} in a nutshell.` : pick(c.rng, c.profile.funny),
        pick(c.rng, [`It's the energy. The energy is the whole bit.`, `No notes. It's perfect.`]),
      ],
      cta: c.rng() < 0.3 ? pick(c.rng, ["You get it.", "This is exactly it, right?"]) : NO_CTA,
    }),
  ],

  bts: [
    (c) => ({
      hook: "Behind the scenes:",
      lines: [
        c.hasTopic ? `Making ${c.topic} look effortless takes a lot of un-effortless work.` : `Everyone sees the finished thing. Nobody sees the 47 attempts before it.`,
        pick(c.rng, [`It's mostly redoing things, fixing mistakes, and trying again.`, `The \"overnight success\" took a lot of boring afternoons.`]),
        pick(c.rng, [`But this is the part I actually love. The messy middle.`, `The process isn't pretty, but the result makes it worth it.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, ["Want more behind-the-scenes?", "Which part should I show next?"]) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["What it looks like vs what it actually is:", "The reality nobody sees:"]),
      lines: [
        c.hasTopic ? `With ${c.topic}, the finished version hides all the chaos.` : pick(c.rng, c.profile.situations),
        pick(c.rng, [`The polished post is 10% of the story.`, `Behind it is a lot of trial, error, and \"okay one more try\".`]),
        c.rng() < 0.4 ? pick(c.rng, [`So if you feel behind, you're not. You're just in the messy middle.`, `It's all part of it. Every version of you is building the next one.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["A little look behind the curtain.", `Day in the life of ${c.profile.aPerson}:`]),
      lines: [
        c.hasTopic ? `Today was a ${c.topic} day, and it was not glamorous.` : `Today was not glamorous.`,
        pick(c.rng, [`There was planning. There was re-planning. There was a snack break that turned into a nap.`, `Lots of small wins, one medium stress, and a decent amount of coffee.`]),
        c.rng() < 0.4 ? `And somehow, at the end, a little progress got made.` : null,
      ].filter(Boolean),
      cta: c.rng() < 0.4 ? pick(c.rng, ["What does your day look like?", "Wanna see the mess behind the magic?"]) : NO_CTA,
    }),
  ],

  hotTake: [
    (c) => ({
      hook: "Hot take:",
      lines: [
        c.hasTopic ? `There's a lot of hype around ${c.topic} — and I think most of it is wrong.` : pick(c.rng, c.profile.hotTakes),
        pick(c.rng, [`I know this is controversial. That's kind of the point.`, `Everyone's gonna be mad and that's fine, I can handle it.`]),
        pick(c.rng, [`But I have my reasons, and they're good ones.`, `I'll defend this position with my whole chest.`]),
      ],
      cta: c.rng() < 0.5 ? pick(c.rng, ["Change my mind.", "Disagree? Drop it below."]) : NO_CTA,
    }),
    (c) => {
      const t = pick(c.rng, c.profile.hotTakes);
      return {
        hook: "I said what I said.",
        lines: [
          c.hasTopic ? `There's a strong opinion in here about ${c.topic}. ${t}` : t,
          pick(c.rng, [`I've been quiet about this for too long.`, `I used to be scared to say it. Not anymore.`]),
          c.rng() < 0.4 ? pick(c.rng, [`It's not even that hot of a take, people just love the status quo.`, `Respectfully, I'm right about this one.`]) : null,
        ].filter(Boolean),
        cta: c.rng() < 0.5 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => ({
      hook: "We should normalize this:",
      lines: [
        c.hasTopic ? `It's weird that we make ${c.topic} such a big deal.` : pick(c.rng, c.profile.hotTakes),
        pick(c.rng, [`It shouldn't be controversial to say this.`, `The reaction to it says more about everyone else than about me.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, ["Agree or not, tell me.", "Am I wrong? Genuinely asking."]) : NO_CTA,
    }),
  ],

  question: [
    (c) => ({
      hook: pick(c.rng, ["Genuine question:", "I need your help settling something."]),
      lines: [
        c.hasTopic ? `For those who know ${c.topic} — how do you actually handle this?` : pick(c.rng, c.profile.questions),
        pick(c.rng, [`I have my way, but I feel like I'm missing something.`, `I've asked everyone I know and I want more opinions.`, `There's no wrong answer, I just want the real ones.`]),
      ],
      cta: c.rng() < 0.6 ? "Drop your answer below." : NO_CTA,
    }),
    (c) => {
      const q = pick(c.rng, c.profile.questions);
      return {
        hook: "Let's discuss:",
        lines: [
          c.hasTopic ? `Since we're on the topic of ${c.topic} — ${q}` : q,
          pick(c.rng, [`Curious if it's just me or a universal thing.`, `This has been on my mind and I need the group's wisdom.`]),
        ],
        cta: c.rng() < 0.6 ? "I'm genuinely curious, tell me." : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["Okay, be honest:", "I'll go first if you will."]),
      lines: [
        c.hasTopic ? `About ${c.topic} — what's your real answer?` : pick(c.rng, c.profile.questions),
        pick(c.rng, [`No judgment here. I want the honest version.`, `Everyone's experience is different, and that's what makes this interesting.`]),
      ],
      cta: c.rng() < 0.5 ? "Comments are open. Let's hear it." : NO_CTA,
    }),
  ],

  promo: [
    (c) => ({
      hook: pick(c.rng, ["I finally put it out there.", "It's live. And I'm a little nervous."]),
      lines: [
        c.hasTopic ? `For the past while I've been working on ${c.topic}.` : pick(c.rng, c.profile.wins),
        pick(c.rng, [`It's not perfect, but it's real, and I'm proud of it.`, `It took longer than I expected and it was so worth it.`, `This is the thing I kept saying I'd do, and now it's done.`]),
        c.rng() < 0.4 ? pick(c.rng, [`If you've been following along, thank you. This one's for you.`, `It's the kind of thing I'd want to know about, so I'm sharing it.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.5 ? "Link in bio if you want to see it." : NO_CTA,
    }),
    (c) => ({
      hook: "So, the thing I've been hinting at:",
      lines: [
        c.hasTopic ? `It's about ${c.topic}. And it's finally ready.` : `It's finally here, and I can't keep it to myself anymore.`,
        pick(c.rng, [`I built this because I kept wishing it existed.`, `This started as a \"what if\" and turned into a real thing.`, `I genuinely think it'll help people, so I made it.`]),
        c.rng() < 0.4 ? pick(c.rng, [`No pressure, just if it's useful to you, it's yours.`, `If it's not your thing, that's totally fine too.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.5 ? "Everything's in my bio." : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["People keep asking about this, so here it is.", "You asked, so I'm finally answering."]),
      lines: [
        c.hasTopic ? `A lot of you have been asking about ${c.topic}, so: it's here.` : `I kept getting DMs about this, so I figured I'd just say it out loud.`,
        pick(c.rng, [`It's live now, and honestly I'm a bit nervous to share it.`, `I made the thing I kept telling myself I'd make.`]),
        c.rng() < 0.4 ? pick(c.rng, [`If it helps you too, that genuinely makes my week.`, `More details if you need them — just ask.`]) : null,
      ].filter(Boolean),
      cta: c.rng() < 0.4 ? "Link's in my bio." : NO_CTA,
    }),
  ],

  achievement: [
    (c) => {
      const w = pick(c.rng, c.profile.wins);
      return {
        hook: pick(c.rng, ["I hit a milestone and it still feels unreal.", "I did the thing."]),
        lines: [
          c.hasTopic ? `Something about ${c.topic} just went right, and I have to share it.` : w,
          pick(c.rng, [`It didn't come easy. There were a lot of \"almost\" moments.`, `Took way longer than I thought, but here we are.`, `I almost didn't get here, honestly.`]),
          pick(c.rng, [`So I'm marking it down. This one means a lot.`, `Small win? Big to me. I'm counting it.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, ["Thanks for being here while I figured it out.", "Appreciate everyone who kept me going."]) : NO_CTA,
      };
    },
    (c) => ({
      hook: "Just want to celebrate a small thing:",
      lines: [
        c.hasTopic ? `Progress on ${c.topic} today, and it feels good.` : pick(c.rng, c.profile.wins),
        pick(c.rng, [`It's the kind of win nobody else would notice, but it's huge to me.`, `I've been chipping away at this for a while.`]),
        c.rng() < 0.4 ? `Anyway. Celebrating it out loud so I remember to be proud.` : null,
      ].filter(Boolean),
      cta: c.rng() < 0.3 ? pick(c.rng, ["What small win are you celebrating?", "Appreciate the support while I got here."]) : NO_CTA,
    }),
    (c) => ({
      hook: pick(c.rng, ["It's official. We did it.", "I've been waiting to say this."]),
      lines: [
        c.hasTopic ? `The ${c.topic} goal I set? It happened.` : `The goal I set months ago finally happened.`,
        pick(c.rng, [`There were days I genuinely didn't think I'd get here.`, `I kept a screenshot from the day I started to remind myself.`]),
        pick(c.rng, [`It's proof that slow progress still counts.`, `I look at it and think about all the \"one more days\" that got me here.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, ["Thanks for following along on this one.", "What goal are you chasing right now?"]) : NO_CTA,
    }),
  ],

  eduPersonal: [
    (c) => ({
      hook: pick(c.rng, ["I failed at this so you don't have to.", "I wish I knew this earlier."]),
      lines: [
        c.hasTopic ? `With ${c.topic}, I made every mistake so you can skip them.` : `I made every mistake on this so you don't have to.`,
        pick(c.rng, [`It took me way too long to figure out what I'm about to tell you.`, `I learned this the hard, slow way.`]),
        pick(c.rng, c.profile.tips),
        pick(c.rng, [`That one change made the biggest difference for me.`, `Once it clicked, everything got easier.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
    (c) => {
      const t = pick(c.rng, c.profile.tips);
      return {
        hook: "Here's what I learned the hard way:",
        lines: [
          c.hasTopic ? `Took a real L with ${c.topic} before it made sense.` : pick(c.rng, c.profile.situations),
          t,
          pick(c.rng, [`I'd have saved myself weeks if I'd just known this.`, `It seems obvious now, but it wasn't then.`]),
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => ({
      hook: pick(c.rng, ["A lesson from my own experience:", "Sharing this because I lived it."]),
      lines: [
        c.hasTopic ? `Being deep in ${c.topic} taught me a few things.` : `A few things experience taught me that nobody warned me about:`,
        pick(c.rng, c.profile.tips),
        pick(c.rng, [`That last one took me the longest to learn.`, `I wish I could go back and tell myself this.`]),
      ],
      cta: c.rng() < 0.4 ? pick(c.rng, CTAS) : NO_CTA,
    }),
  ],

  shortThought: [
    (c) => {
      const w = pick(c.rng, c.profile.wins);
      return {
        hook: "",
        lines: [
          c.hasTopic ? `${c.topic} has been teaching me patience. Slowly.` : w,
          c.rng() < 0.5 ? pick(c.rng, [`Small progress is still progress.`, `The slow days count too.`, `One more day. It adds up.`]) : null,
        ].filter(Boolean),
        cta: c.rng() < 0.3 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
    (c) => {
      const t = pick(c.rng, c.profile.hotTakes);
      return {
        hook: "",
        lines: [
          c.hasTopic ? `Unpopular thought on ${c.topic}:` : `Thought:`,
          t,
        ],
        cta: c.rng() < 0.4 ? pick(c.rng, ["Agree?", "Thoughts?"]) : NO_CTA,
      };
    },
    (c) => {
      const f = pick(c.rng, c.profile.funny);
      return {
        hook: "",
        lines: [c.hasTopic ? `Just a small thought about ${c.topic}...` : f, c.rng() < 0.5 ? "That's all. That's the post." : null].filter(Boolean),
        cta: c.rng() < 0.3 ? pick(c.rng, CTAS) : NO_CTA,
      };
    },
  ],
};

// ---------------------------------------------------------------------------
// Platform formatting
// ---------------------------------------------------------------------------

const EMOJI_INTENSITY = {
  casual: 2,
  witty: 1,
  honest: 0,
  energetic: 3,
  professional: 0,
  chill: 1,
};

const PLATFORM_EMOJIS = {
  instagram: ["✨", "🔥", "🙃", "🤝", "😭", "👀", "💭"],
  tiktok: ["😭", "😂", "🔥", "🤯", "👀"],
  linkedin: [],
  x: [],
  facebook: ["🤔", "👀", "😅", "🙋‍♀️"],
};

const PLATFORM_LIMITS = {
  instagram: 2200,
  tiktok: 1500,
  linkedin: 3000,
  x: 280,
  facebook: 3000,
};

function emojisFor(platform, tone, rng, count) {
  const pool = PLATFORM_EMOJIS[platform] || [];
  const intensity = EMOJI_INTENSITY[tone] ?? 2;
  if (!pool.length || intensity === 0 || count <= 0) return [];
  const n = Math.min(count, intensity);
  return shuffle(rng, pool).slice(0, n);
}

function renderForPlatform(platform, blocks, ctx) {
  const { hook, lines, cta } = blocks;
  const tone = ctx.input.tone || "casual";

  let content = [];
  if (hook) content.push(hook);

  const body = lines.filter(Boolean);
  if (platform === "tiktok") {
    // Short punchy lines, one per line
    content.push(...body);
  } else {
    // Paragraph flow — merge short lines into a couple of paragraphs for
    // the longer-form platforms so it reads like a caption, not a script.
    content.push(...groupIntoParagraphs(body));
  }

  // CTA as its own closing line
  if (cta && cta !== NO_CTA) content.push(cta);

  // Emojis — a single tasteful emoji (or two, for an energetic tone)
  if (platform !== "x" && platform !== "linkedin") {
    const emojis = emojisFor(platform, tone, ctx.rng, 1 + Math.floor(ctx.rng() * 2));
    if (emojis.length) {
      const idx = Math.max(0, content.length - 1 - (cta && cta !== NO_CTA ? 1 : 0));
      if (idx >= 0 && idx < content.length && !/[\p{Extended_Pictographic}]/u.test(content[idx])) {
        content[idx] = content[idx] + " " + emojis.slice(0, Math.min(2, emojis.length)).join("");
      }
    }
  }

  let text = content.filter((l) => l && l.trim()).join(platform === "tiktok" ? "\n" : "\n\n");
  text = text.replace(/\s+/g, " ").trim(); // normalize accidental double spaces

  if (platform === "x") {
    text = clipForX(text);
  }
  return text;
}

function groupIntoParagraphs(lines) {
  const out = [];
  let buf = "";
  for (const line of lines) {
    if (!line) continue;
    if (buf && buf.length + line.length > 180) {
      out.push(buf.trim());
      buf = line;
    } else {
      buf = buf ? buf + " " + line : line;
    }
  }
  if (buf) out.push(buf.trim());
  return out;
}

function clipForX(text) {
  let t = text.replace(/\n{2,}/g, "\n").trim();
  if (t.length <= 280) return t;
  // Keep the first 2 lines if short, else just trim
  const parts = t.split("\n");
  if (parts.length > 1 && parts[0].length + parts[1].length < 200) {
    t = parts.slice(0, 2).join("\n");
  }
  if (t.length > 280) t = t.slice(0, 277).trimEnd() + "…";
  return t;
}

function hashtagsFor(platform, profile, ctx) {
  const topicTag = ctx.hasTopic ? `#${slug(ctx.topic)}` : null;
  const nicheTags = profile.hashtags || [];
  switch (platform) {
    case "x":
      return [topicTag || nicheTags[0]].filter(Boolean).slice(0, 2);
    case "linkedin":
      return nicheTags.slice(0, 3);
    case "instagram":
      return [...(topicTag ? [topicTag] : []), ...nicheTags].slice(0, 5);
    case "tiktok":
      return [topicTag || nicheTags[0], ...nicheTags.slice(1, 3), "#fyp"].filter(Boolean).slice(0, 4);
    case "facebook":
      return [topicTag, nicheTags[0]].filter(Boolean).slice(0, 2);
    default:
      return nicheTags.slice(0, 3);
  }
}

// On-screen text ideas for short-form video platforms
function onScreenFor(platform, blocks, ctx) {
  if (platform !== "tiktok") return null;
  const ideas = [];
  if (blocks.hook) ideas.push(blocks.hook.replace(/^POV:\s*/i, "").slice(0, 60));
  if (ctx.hasTopic) ideas.push(pick(ctx.rng, [`POV: ${ctx.topic}`, `me ${ctx.topic.toLowerCase()}`]));
  if (blocks.cta && blocks.cta !== NO_CTA) ideas.push(blocks.cta.slice(0, 60));
  else ideas.push(pick(ctx.rng, ["tag a friend who gets it", "wait for it…", "part 2? 👀", "the ending caught me off guard"]));
  // dedupe + drop empties
  const seen = new Set();
  return ideas.filter((i) => i && !seen.has(i) && seen.add(i)).slice(0, 3);
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

function buildTypeOrder(input, rng) {
  const count = Math.max(1, parseInt(input.count, 10) || 1);
  const requested = input.contentType || "auto";

  if (requested === "auto" || requested === "mixed" || !requested) {
    const base = [...AUTO_MIX];
    if (input.platform === "x") base.push("shortThought");
    const cycle = shuffle(rng, base);
    const order = [];
    let prev = null;
    for (let i = 0; i < count; i++) {
      let next = cycle[i % cycle.length];
      // avoid adjacent repeats at cycle boundaries
      if (next === prev && cycle.length > 1) {
        next = cycle[(i + 1) % cycle.length];
      }
      order.push(next);
      prev = next;
    }
    return order;
  }

  return Array.from({ length: count }, () => requested);
}

function pickVariant(rng, pool, used) {
  if (!pool || !pool.length) return pool[0];
  const available = pool
    .map((fn, i) => ({ fn, i }))
    .filter((v) => !used.has(v.i));
  const choice = available.length ? available : pool.map((fn, i) => ({ fn, i }));
  const picked = pick(rng, choice);
  used.add(picked.i);
  return picked.fn;
}

function generateOne(rng, input, profile, type, usedVariants, usedTexts) {
  let attempts = 0;
  while (attempts < 4) {
    attempts++;
    const ctx = buildContext(rng, input, profile, usedTexts);
    const pool = TYPES[type] || TYPES.relatable;
    const fn = pickVariant(rng, pool, usedVariants);
    const blocks = fn(ctx);

    let text = renderForPlatform(input.platform, blocks, ctx);
    if (containsBanned(text)) continue;
    if (usedTexts.has(text)) continue;

    usedTexts.add(text);
    return {
      type,
      label: type === "shortThought" ? "Short thought" : TYPE_LABELS[type] || type,
      text,
      onScreen: onScreenFor(input.platform, blocks, ctx),
    };
  }
  // fallback — very last resort
  const ctx = buildContext(rng, input, profile, usedTexts);
  return {
    type,
    label: TYPE_LABELS[type] || type,
    text: renderForPlatform(input.platform, { hook: pick(rng, HOOK_BANKS.curiosity), lines: [ctx.hasTopic ? `So, ${ctx.topic}. It's a whole thing.` : pick(rng, c.profile.situations), `More to share soon.`], cta: NO_CTA }, ctx),
  };
}

export function generateContent(input = {}) {
  const seed = typeof input.seed === "number" ? input.seed : Date.now();
  const rng = mulberry32(seed);

  const platform = input.platform || "instagram";
  const profile = resolveProfile(input.niche);

  const typeOrder = buildTypeOrder(input, rng);
  const usedVariants = new Set();
  const usedTexts = new Set();

  const posts = [];
  for (const type of typeOrder) {
    const post = generateOne(rng, input, profile, type, usedVariants, usedTexts);
    posts.push(post);
  }

  return {
    posts,
    hashtags: hashtagsFor(platform, profile, { hasTopic: !!(input.topic || "").trim(), topic: (input.topic || "").trim() }),
    platform,
    niche: profile.label,
    contentType: typeOrder,
    count: posts.length,
  };
}

export default generateContent;