module.exports = {
  config: {
    name: "emojibot",
    version: "1.0",
    credit: "SHANKAR SUMAN",
    countDown: 5,
    role: 0,
    shortDescription: "no-prefix",
    longDescription: "Bot Will Reply You In Nepali Language",
    category: "non-prefix",
    usePrefix: false,
    guide: {
      en: "{p}{n}",
    }
  },

  onStart: async function ({  }) { },

  onChat: async function ({ api, event, args, Threads, userData }) {
    const { threadID, messageID, senderID } = event;
    const emojis = ["😀", "😄", "😁", "😆", "😅", "😂", "🤣", "😭", "😉", "kamina", "kutta", "tharki", "call", "chuti", "pagal", "hate", "nikal", "bhag", "pgl", "wel", "😥"];

    const replies = {
      "😀": ["सराफत से मुस्कुरा रहे हो 😀😀", "😀😀😀😀"],
      "😄": ["चूहे जैसा मुह मत बना 😆", "😄😄😄😄"],
      "😁": ["लगता है आज पहली बार ब्रश किया है 😁", "कोलगेट का प्रचार कर रहे हो क्या?😂", "ऐसे कौन हस्ता है दोनो दांत चिपका के यार😝👈"],
      "😆": ["आंख बंद करके क्यू हस रहे हो ठरकी 😆", "आंख खोल के हस न मुझे तेरी आंखों में बस जाना है।😝", "😐😐😐😐"],
      "😅": ["तेरे सर से पानी क्यू टपक रहा 😅", "लगता तेरे सर पर ऊपर से कौवा हग दिया है।😂", "😅😅😅😅"],
      "😂": ["इतनी हसी क्यू आ रही है इस हसी के पीछे क्या राज है बताओ बताओ हमसे ना सरमाओ 😂🤤", "हंसना नही आता है तो हसमुखिया देवी से जाकर मिलो😐 सीखा देगी वो🥺", "😂😂😂"],
      "🤣": ["ज्यादा मत हस, एक मुक्के मे सारे दांत तोड़ दूंगा 😂", "🤣🤣🤣"],
      "😭": ["अरे यार रोते नही पागल किया हुआ है मुझे बताओ बाबू 🥺🥺🥺", "क्या हुआ बाबू क्यूं रो रहे हो ग्रुप में बाढ़ आ जाएगी🥺", "😭😭😭"],
      "😉": ["आंख क्यूं मार रहे हो 🥺🤟", "सरेआम पब्लिक प्लेस में किसको आंख मार रहे हो बेशरम?🧐", "😉😉😉"],
      "kamina": ["तु है कमिना मैं तो बोट हूं।🥺", "तु डबल कमिना 😐🤐😑", "तु है सबसे बड़ाकमिना", "तु है कमिना मैं तो बोट हूं।😐🤐"],
      "kutta": ["तु कुतिया 😷", "कुत्ता बोले तो ग्रुप से भाग जाऊंगा🥺", "दूर हो जा कुत्ते मेरे नजरों से 😷"],
      "tharki": ["तु है ठरकी🥺", "तु है ठरकी मैं तो बोट हूं।🥴", "तु ठरकी तेरा बाप भी ठरकी बस 😒👈"],
      "call": ["यार मैं कैसे कॉल आऊं मैं तो बोट हूं।🥺👈", "मैं कॉल नही आ सकता मेरी gf कसम दी है अगर किसी पराई लड़की से कॉल पर बात किया तो कुट दूंगी।🥺👈", "रिचार्ज खतम हो गया 😒👈", "नंबर दो बेबी अभी कॉल आता हूं।🙈👈"],
      "chuti": ["तु है चुतिया 😡👈", "तु है चुतिया मैं तो बोट हूं।😒👈", "अरे चुतिया चुप हो जा 😡😒👈"],
      "pagal": ["हम पागल नही बाबू हमारा दिमाग खराब है।😒😝👈", "तुम भी पागल हम भी पागल पागल सारा जमाना", "तुम हो पागल 😒👈"],
      "hate": ["आई नफरत उह 😏👈", "आई हेट यू थू 😏👈", "आई लव उह बाबू 😝😘🙈👈"],
      "nikal": ["कहा से निकलूं?🤔👈", "तु निकल 😏👈", "नही निकलना है समझा 😏👈"],
      "bhag": ["हां चलो हम दोनो भाग चलते है 😝👈", "तु भाग जा ठरकी 😏👈", "किसको लेकर भागना है?🤔"],
      "pgl": ["हम पागल नही बाबू हमारा दिमाग खराब है।😒😝👈", "तुम भी पागल हम भी पागल पागल सारा जमाना", "तुम हो पागल 😒👈"],
      "wel": ["धन्यवाद 😇🤚", "शुक्रिया 😇🤚", "आपका बहुत बहुत धन्यवाद 😇🤚", "थैंक्यू 😇🤚"],
      "😥": ["बाबू किसने मारा आपको 😥👈", "रोऊ नही मेरी जान 😥👈", "क्या हुआ बाबू 😥👈"],
    };

    // Array to store mentions
    const mentions = [];

    // Convert event.body to lowercase
    const lowercaseBody = event.body.toLowerCase();

    // Check if the lowercase message contains any of the emoji keys from replies
    for (const emoji of emojis) {
      if (typeof emoji === 'string') {
        // Check if the lowercase message includes the lowercase emoji
        if (lowercaseBody.includes(emoji.toLowerCase())) {
          const reply = replies[emoji];
          // If reply is an array, randomly select one reply
          const randomReply = Array.isArray(reply) ? reply[Math.floor(Math.random() * reply.length)] : reply;
          // Mention sender by getting user info
          const senderInfo = await api.getUserInfo(senderID);
                    const senderName = senderInfo[senderID].name;
          const msg = {
            body: `${senderName}, ${randomReply}`,
            mentions: [{
              tag: senderID,
              id: senderID
            }]
          };
          // Send the message with mention
          return api.sendMessage(msg, threadID, messageID);
        }
      }
    }

    // Check if the lowercase message contains any of the keys from replies
    for (const key in replies) {
      if (typeof replies[key] === 'string') {
        // Check if the lowercase message includes the lowercase key
        if (lowercaseBody.includes(key.toLowerCase())) {
          const reply = replies[key];
          // If reply is an array, randomly select one reply
          const randomReply = Array.isArray(reply) ? reply[Math.floor(Math.random() * reply.length)] : reply;
          // Mention sender by getting user info
          const senderInfo = await api.getUserInfo(senderID);
          const senderName = senderInfo[senderID].name;
          const msg = {
            body: `${senderName}, ${randomReply}`,
            mentions: [{
              tag: senderID,
              id: senderID
            }]
          };
          // Send the message with mention
          return api.sendMessage(msg, threadID, messageID);
        }
      }
    }
  }
};
