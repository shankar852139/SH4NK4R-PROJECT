/*const imgur = require("imgur");
const fs = require("fs");
const { downloadFile } = require("../../utils/index");

module.exports.config = {
  name: "imgur",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "mod",
  description: "Imgur",
  commandCategory: "tiện ích",
  usages: "[reply]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, type, messageReply, messageID } = event;
  const ClientID = "c76eb7edd1459f3";
  if (type !== "message_reply" || messageReply.attachments.length == 0) return api.sendMessage("Bạn phải reply một v/
  imgur.setClientId(ClientID);
  const attachmentSend = [];
  async function getAttachments(attachments) {
    let startFile = 0;
    for (const data of attachments) {
      const ext = data.type == "photo" ? "jpg" :
        data.type == "video" ? "mp4" :
          data.type == "audio" ? "m4a" :
            data.type == "animated_image" ? "gif" : "txt";
      const pathSave = __dirname + `/cache/${startFile}.${ext}`
      ++startFile;
      const url = data.url;
      await downloadFile(url, pathSave);
      attachmentSend.push(pathSave);
    }
  }
  await getAttachments(messageReply.attachments);
  let msg = "", Succes = 0, Error = [];
  for (const getImage of attachmentSend) {
    try {
      const getLink = await imgur.uploadFile(getImage)
      console.log(getLink);
      msg += `"${getLink.link}",\n`
      fs.unlinkSync(getImage)
    } catch {
      Error.push(getImage);
      fs.unlinkSync(getImage)
    }
  }
  return api.sendMessage(`${msg}`, threadID);
}*/

const axios = require("axios");

function stringify(Obj, t) {
  let box = [];
  for (let i in Obj) {
    if (Obj.hasOwnProperty(i)) {
      let a = t ? t + "[" + i + "]" : i;
      let n = Obj[i];
      let enc = null !== n && "object" == typeof n ? stringify(n, a) : encodeURIComponent(a) + "=" + encodeURIComponent(n);
      box.push(enc);
    }
  }
  return box.join("&");
}

module.exports.config = {
  name: "imgur3",
  version: "1.0.0",
  hasPermssion: 0,
  description: "lấy url imgur trên message",
  credits: "Sam & API Imgur",
  commandCategory: "Phương Tiện",
  usages: "[reply]",
  cooldowns: 5
}

function imgurVideoCreateURL(url) {
  var cb;
  var returnPromise = new Promise(function (resolve, reject) {
    cb = function (err, resData) {
      if (err) reject(err);
      resolve(resData);
    }
  });
  axios({
    method: "POST",
    url: "https://sumiproject.space/imgur",
    headers: {
      Authorization: 'Client-ID fc9369e9aea767c'
    },
    data: stringify({
      video: url,
      type: "URL",
      name: Date.now() + ".mp4"
    })
  })
    .then(async function ({ data }) {
      var ticket = data.data.ticket;
      var opt = {
        method: "GET",
        url: "https://sumiproject.space/imgur?link=" + ticket,
        headers: {
          Authorization: 'Client-ID fc9369e9aea767c'
        }
      };
      await axios(opt);
      const { data: res } = await axios(opt);
      cb(null, `https://i.imgur.com/${res.data.done[ticket]}.mp4`);
    })
    .catch((err) => {
      cb(err);
    });
  return returnPromise;
}

function imgurCreateURL(url) {
  var cb;
  var returnPromise = new Promise(function (resolve, reject) {
    cb = function (err, resData) {
      if (err) reject(err);
      resolve(resData);
    }
  });
  axios({
    method: "POST",
    url: "https://sumiproject.space/imgur",
    headers: {
      Authorization: 'Client-ID fc9369e9aea767c'
    },
    data: stringify({
      image: url
    })
  })
    .then(function ({ data }) {
      cb(null, data.data.link);
    })
    .catch((err) => {
      cb(err);
    });
  return returnPromise;
}

module.exports.run = async function ({ api, event, args }) {
  const { type, messageReply, threadID } = event;
  let msg = "";

  try {
    if (type == "message_reply") {
      if (messageReply.attachments.length < 1) msg += "Vui long chi reply anh/video";
      else for (let Obj of messageReply.attachments) {
        var imgurURL = (Obj.type == "photo" || Obj.type == "animated_image") ? await imgurCreateURL(Obj.url) : Obj.type == "video" ? await imgurVideoCreateURL(Obj.url) : "[Function: imgurError]";
        msg += `"${imgurURL}",\n`;
      }
    }
    else msg += "Vui long reply anh/video";
    
    return api.sendMessage(msg, threadID);
  } catch (e) {
    console.log(e);
    return api.sendMessage(`Da xay ra loi\n${e}`, threadID);
  }
}
