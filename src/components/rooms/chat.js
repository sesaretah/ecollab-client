import $ from "jquery";
import { socket } from "../../socket.js";

export function socketHandle(msg) {
  var self = this;
  var parsed = msg;
  switch (parsed.type) {
    case "chat":
      self.appendChat(parsed.c);
      break;
  }
}

export function keydownHandler(e){
    if(e.keyCode===13 && e.ctrlKey) this.send()
  }

export function appendChat(c) {
  var exist = this.state.chats.filter((item) => item.uuid === c.uuid);
  if (exist && exist.length === 0) {
    if (this.state.chats && this.state.chats.length > 100) {
      this.setState({ chats: this.state.chats.slice(1).concat(c)});
    } else {
      this.setState({ chats: this.state.chats.concat(c) }, () => {
        this.scrollChat();
      });
    }
  }
}

export function scrollChat(){
    $("#chat-box").stop().animate({
        scrollTop: $("#chat-box")[0].scrollHeight
    });
}

export function chatItems() {
  var result = [];
  this.state.chats.map((chat) => {
    result.push(
      <div class="list-group-item p-tight" id={'chat-'+chat.uuid}>
        <div class="row">
          <div class="col-auto">
            <a href="#">
              <span class="avatar avatar-sm">{chat.initials}</span>
            </a>
          </div>
          <div class="col text-sm">
           <span class="chat-title">{chat.name}</span>
           <div class="form-hint mt-n1">{chat.content}</div>
          </div>
        </div>
      </div>
    );
  });
  return result;
}

export function throttle(c, t) {
  if (Date.now() - this.state.lastTime > 100) {
    this.setState({ lastTime: Date.now() }, () => {
      this.wsSend({ type: t, c: c });
    });
  }
}

export function send() {
    console.log(this.state.item)
  if (this.state.item) {
    this.throttle(this.state.item, "chat");
    this.appendChat(this.state.item);
    $("#chat-form").val("");
  }
}

export function wsSend(msg, sender = this.state.userUUID) {
  msg["room"] = this.state.roomId;
  msg["sender"] = sender;
  socket.emit("message", msg);
}
