module.exports = [
  {
    tag: "discount",
    patterns: [
      "Do you have any discount?",
      "How many percent is maximum off on this website?",
      "What courses are free on this website?",
      "What courses have discount on this website?",
      "I need a free course",
      "free courses",
      "low-price courses",
    ],
    responses: [
      "Of course, Hacademy have discount for a variety of courses",
      "Hacademy does not have any free courses at the moment!",
      "Hacademy occasionally has discount up to 100% off!",
      "There are free courses at the moment on Hacademy website!",
      "There are coupons for courses available at the moment on Hacademy website!",
    ],
  },

  {
    tag: "course",
    patterns: [
      "What courses does Hacademy have?",
      "I need some Computer Science courses",
      "I need a course",
      "Could you tell me about Javascript Courses?",
      "Can you recommend me some courses?",
      "How many courses does Hacademy?",
      "course",
      "English course",
      "Music course",
      "javascript course",
    ],
    responses: [
      "Hacademy has courses from a variety of subjects that you can find!",
      "There are more than 10 subjects on Hacademy's site that you can check out!",
      "Hacademy has more than 100 courses that worth checking out!",
      "There are more than 10 courses available in this subject!",
    ],
  },

  {
    tag: "payment",
    patterns: [
      "How can I purchase a course?",
      "How to buy a courses?",
      "How to purchase a courses?",
      "online payment",
      "What cards used for payment?",
      "I have Visa card",
      "Can I pay with my Visa card?",
      "I have Master card",
      "Can I pay with my Master card?",
      "I have Discover card",
      "Can I pay with my Discover card?",
      "I have American Express card",
      "Can I pay with my American Express card?",
      "pay with PayPal",
      "I have PayPal",
      "Can I pay with PayPal?",
    ],
    responses: [
      "Hacademy supports all kind of cards for online payment (VISA / MASTER / DISCOVER / AMERICAN EXPRESS Card)!",
      "Hacademy integrates online payment for VISA / MASTER / DISCOVER / AMERICAN EXPRESS Card!",
      "Hacademy does not support PayPal payment at the moment! Please try credit cards!",
    ],
  },

  {
    tag: "subject",
    patterns: [
      "What subject does Hacademy have?",
      "subject",
      "How many subjects on Hacademy?",
      "Is there Design subject here?",
      "How many course on each subject?",
    ],
    responses: [
      "Hacademy has more than 10 subjects throughout every educational levels!",
      "More than 10 subjects and over 100 courses are available on Hacademy website!",
      "There are more than 10 subjects and over 100 courses on Hacademy website",
    ],
  },

  {
    tag: "lecturer",
    patterns: [
      "How to become a lecturer on Hacademy?",
      "How to upload courses on Hacademy?",
      "Can I become a teacher on Hacademy?",
      "Can I teach my courses on Hacademy?",
      "I want to be a teacher on Hacademy",
      "be a teacher on Hacademy",
      "How to get teacher account?",
      "How to login as a teacher?",
      "How to login as a lecturer?",
      "How does Hacademy recruit lecturer?",
    ],
    responses: [
      "1. You can create an account as a lecturer on Hacademy at https://cafocc.web.app/auth/register \n\n\
      2. As you register as a lecturer on Hacademy, Hacademy team will check your profile and decide wether or not you're eligible to become a lecturer on our website!\n\n\
      3. There is Partners Policies for anyone wants to be a lecturer on Hacademy website",
    ],
  },

  {
    tag: "hacademy",
    patterns: [
      "What is Hacademy?",
      "What is this website for?",
      "definition of Hacademy",
      "Why Hacademy?",
      "explain Hacademy",
      "What is this website?",
      "about Hacademy",
    ],
    responses: [
      "Hacademy is a website that provides online courses and we have been aggregating more than 10 subjects, over 100 online courses which includes 1000+ lessons throughout every educational levels! \nhttps://cafocc.web.app",
      "Hacademy is a place that you can study AT HOME! Here we have everything you need for a course such as related video, files, lessons, feedback and you can also directly raise your question on a certain lesson! \nhttps://cafocc.web.app",
      "Hacademy is not only for learners, we also recruit and have Partners Policies for who want to become a lecturer and upload your own lecture on Hacademy website! \nhttps://cafocc.web.app",
    ],
  },

  {
    tag: "contact",
    patterns: [
      "How to contact?",
      "contact when I have a problem using the website",
      "I've got into some troubles using the website",
      "Where to contact?",
      "contact section",
    ],
    responses: [
      "If you want to contact, please go to the Contact section we have on Hacademy website \nhttps://cafocc.web.app/contact",
      "Hacademy contact information is included on its website in Contact section \nhttps://cafocc.web.app/contact",
      "You can contact via this email (dhtc.kltn@gmail.com) for any supports! \nhttps://cafocc.web.app/contact",
    ],
  },

  {
    tag: "comment",
    patterns: [
      "How can I comment?",
      "How can I ask something during the lesson?",
      "ask questions during the lesson",
      "questions during study",
      "comment on a lesson",
    ],
    responses: [
      "You can raise your questions during every lesson and you can also see all comments from others who are learning that course!",
      "Every lesson has a comment section for all learners in Hacademunity to raise questions and help each other from any struggling!",
      "If you have problems during your study process, you can post comments so that anyone's studying that lesson can help you!",
    ],
  },

  {
    tag: "lesson",
    patterns: [
      "How many lessons does a course have?",
      "What does a lesson have?",
      "what in a lesson?",
    ],
    responses: [
      "Each lesson will have a description about the contents of the lesson, a lecture video, comment section to ask questions and files which relate to the lesson if any!",
      "The number of lessons will depend on the course, the lecturer will organize and set up the course in the most effective and suitable way for your learning path!",
    ],
  },

  {
    tag: "feedback",
    patterns: [
      "feedback",
      "How can I give feedback?",
      "feedback section?",
      "I want to give feedback for this course",
      "Where can I see the feedback?",
    ],
    responses: [
      "You can give feedback after you've finished the course!",
      "Each courses you're taking will have a feedback section occasionally during your learning process!",
      "All feedback from other learners who have been taking the course will be displayed for you to have a review and make a better decision!",
    ],
  },

  {
    tag: "register",
    patterns: [
      "How can I create an account?",
      "Can I login with my facebook account?",
      "Can I login with my google account?",
      "I need an account?",
      "create an account on Hacademy",
      "create learner account",
      "create an account",
      "register",
      "I want to register",
      "create user"
    ],
    responses: [
      "• It's very simple, go to Hacademy website and click on Register to sign up (https://cafocc.web.app/auth/register) for an account if you don't have one! You can also use your Facebook/Google account to log into our site! \n• Registeration requires your email and a password for our site, after you've done signing up, a verification email will be sent to your inbox!",
    ],
  },

  {
    tag: "login",
    patterns: [
      "How can I login?",
      "how to login?",
      "learner login?",
      "How to login?",
      "login",
      "sign in",
      "connect facebook",
      "How can I connect to facebook?",
      "How to connect to my Facebook account"
      "I want to sign in with my account"
    ],
    responses: [
      "• Go to Login page: https://cafocc.web.app/auth/login \n• If you don't have account access Register page: https://cafocc.web.app/auth/register to sign up.",
    ],
  },

  {
    tag: "forgot_password",
    patterns: [
      "I forgot my password",
      "How can a retrieve my password?",
      "forgot password",
      "I don't remember my password",
      "password retrieving",
      "I need my password back!",
      "I have forgotten password"
    ],
    responses: [
      "Go to Forgot Password page: https://cafocc.web.app/auth/forgot-password on our site and fill in your email, Hacademy system will send you an email to change your password!",
    ],
  },
  {
    tag: "verification",
    patterns: [
      "I don't receive verification email",
      "verify my account?",
      "verify account",
      "resend verification email",
      "verification account",
    ],
    responses: [
      "• After you registered, you will have to verify your email and Hacademy will send you a link to do it! \n\n• Hacademy will send you an verification email, if you don't see it in your inbox, please double-check your Spams Folder! \n\n• Click on the link in the verification email, it will redirect you to Hacademy website and you will be done verifying!",
    ],
  },
  {
    tag: "report",
    patterns: [
      "How can I report a course?",
      "file a report",
      "report a course",
      "how to report?",
      "I need to report!",
      "how does reports take place?",
    ],
    responses: [
      "You can report while you're giving feedback to that course! Hacademy Specialties Management team will always take a look on your reports and issue critical solution!",
      "To report, you have to accept whenever the feedback section pops up! Hacademy Specialties Management team will always take a look on your reports and issue critical solution!",
    ]
  },
  {
    tag: "popular_course",
    patterns: [
      "popular courses",
      "Can I get most popular courses on your site?",
      "I need some most-learned courses on your site",
      "most-learned courses",
      "Can I get most-rated courses on your site?",
      "I need some most-rated courses on your site",
      "What courses people usually take on your site?",
      "most-enrolled courses",
      "suggest me some popular courses",
      "suggest me some most-rated courses"
    ],
    responses: []
  },
  {
    tag: "latest_course",
    patterns: [
      "latest courses",
      "Can I get most recent courses?",
      "I need latest courses on your site",
      "suggest me some newest courses on your site",
    ],
    responses: []
  },
  {
    tag: "check_cart",
    patterns: [
      "I want to check my cart",
      "What courses do I have in my cart right now?",
      "How many courses do I have in my cart?",
      "How much of the cost in my cart?",
      "I want to check the number of courses in my cart",
      "I want to check the quantity of courses in my cart",
      "my cart detail",
      "courses in my cart",
      "check cart"
    ],
    responses: []
  },
  {
    tag: "add_coupon",
    patterns: [
      "how can I add coupon?",
      "sale off courses",
      "how can I apply discount on my courses?",
      "price down my courses",
      "reduce courses cost",
      "reduce courses price",
      "coupon"
    ],
    responses: []
  },
  {
    tag: "payment",
    patterns: [
      "Can I pay with my VISA/MASTER/DISCOVER card",
      "online payment",
      "How can I pay for a course?",
      "payment"
    ],
    responses: []
  },
  {
    tag: "update_profile",
    patterns: [
      "I want to change my password",
      "I forgot my password",
      "I want to change my display name",
      "I want to change my first name",
      "I want to change my last name",
      "change profile",
      "update profile",
      "I want to update my profile"
    ],
    responses: []
  },
  {
    tag: "schedule",
    patterns: [
      "I want to be notified about my courses every Mondays and Tuesdays at 3 pm.",
      "notify me about my courses everyday in the week at 20:30.",
      "turn on notify",
      "reminder",
      "notification",
      "notify",
      "alert",
      "I want to set up a timer on my courses every Wednesdays and Fridays at 17h pm.",
      "Turn on timer on my courses every Thursdays and Saturdays at 6h20m.",
    ],
    responses: []
  },
  {
    tag: "survey",
    patterns: [
      "I want to conduct a survey",
      "survey",
      "How to do a survey?",
      "I want to send feedback for Chatbot"
    ],
    responses: []
  },
  {
    tag: "help",
    patterns: [
      "help",
      "i need your help",
      "how to use chatbot?",
      "chatbot workflow",
      "how to chat with bot?",
      "help me",
      "I need instructions for using chatbot",
      "guide me"
    ],
    responses: []
  },
  // ---------------------------- NEW -----------------
  {
    tag: "feature",
    patterns: [
      "show me some features",
      "i need more features",
      "what can you do?",
      "what can i do here?"
    ],
    responses: []
  },
  {
    tag: "suggestion",
    patterns: [
      "suggest courses",
      "Can I get some courses on your site?",
      "I need some courses on your site",
      "recommended courses",
      "Can I get recommended courses on your site?",
      "I need some recommended courses on your site",
      "What courses you usually recommend?",
      "most-suggested courses",
      "suggest me some courses",
      "recommend me some courses",
    ],
    responses: []
  },
  {
    tag: "next_step",
    patterns: [
      "I have done learning this course, what's next?",
      "what courses i should learn next?",
      "next courses i should take to improve",
      "what is the next-step after i have done this course?",
      "are there some courses more advanced than this?"
    ],
    responses: []
  },
  {
    tag: "frequently_asked_questions_(faq)",
    patterns: [
      "faq",
      "can i get some faq?",
      "frequently asked questions",
      "questions frequently asked",
      "what questions people usually ask?"
    ],
    responses: [
      "What courses are on Hacademy?\nHow can I pay for a course?\nCan I check my current cart?\nHow can I set timer for my courses?\nHow can I have an account on Hacademy?\nHow many items are there in my cart?\nCan I check out my cart?\nHow to become a learner on Hacademy?\nHow to become a lecturer on Hacademy?\nHow can I update my profile?\nWhat is the next-step after I have done some courses?\nHow can I report a course?\nHow can I give feedback to a course?\nHow can I comment on a lesson?\nHow can I contact to other people?"
    ]
  },
];
