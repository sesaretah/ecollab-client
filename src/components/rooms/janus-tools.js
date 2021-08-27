import Janus from "../../janus.js";
import $ from "jquery";
export function sessionCreate(room) {
  var self = this;
  console.log("Trying to connect to", room);
  Janus.init({
    debug: "none",
    callback: function () {
      var janus = new Janus({
        server: self.state.server,
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          {
            url: "turn:sync1.ut.ac.ir:3478",
            username: "shafiei",
            credential: "12345678",
          },
        ],
        success: function () {
          // Attach to AudioBridge plugin
          janus.attach({
            plugin: "janus.plugin.audiobridge",
            opaqueId: self.state.opaqueId,
            success: function (pluginHandle) {
              self.setState({ mixertest: pluginHandle, janus: janus });
              Janus.log(
                "Plugin attached! (" +
                  self.state.mixertest.getPlugin() +
                  ", id=" +
                  self.state.mixertest.getId() +
                  ")"
              );
              self.registerUsername(room);
            },
            error: function (error) {
              Janus.error("  -- Error attaching plugin...", error);
            },
            consentDialog: function (on) {
              Janus.debug(
                "Consent dialog should be " + (on ? "on" : "off") + " now"
              );
            },
            iceState: function (state) {
              Janus.log("ICE state changed to " + state);
            },
            mediaState: function (medium, on) {
              Janus.log(
                "Janus " +
                  (on ? "started" : "stopped") +
                  " receiving our " +
                  medium
              );
            },
            webrtcState: function (on) {
              Janus.log(
                "Janus says our WebRTC PeerConnection is " +
                  (on ? "up" : "down") +
                  " now"
              );
            },
            onmessage: function (msg, jsep) {
              Janus.debug(" ::: Got a message :::", msg);
              var event = msg["audiobridge"];
              Janus.debug("Event: " + event);
              if (event) {
                //console.log(event, msg);
                if (event == "talking") {
                  self.participantChangeStatus(msg["id"], true);
                }
                if (event == "stopped-talking") {
                  self.participantChangeStatus(msg["id"], false);
                }
                if (event === "joined") {
                  // Successfully joined, negotiate WebRTC now
                  if (msg["id"]) {
                    self.setState({
                      myid: msg["id"],
                    });
                    Janus.log(
                      "Successfully joined room " +
                        msg["room"] +
                        " with ID " +
                        self.state.myid +
                        "with role:" +
                        self.currentRole()
                    );
                    var role = self.currentRole();
                    self.addParticipant(
                      msg["id"],
                      self.state.fullname +
                        "§" +
                        self.state.userUUID +
                        "§" +
                        self.state.userColor +
                        "§" +
                        self.state.initials +
                        "§" +
                        role
                    );

                    if (!self.state.webrtcUp) {
                      self.setState({ webrtcUp: true });
                      // Publish our stream
                      self.state.mixertest.createOffer({
                        media: {
                          video: false,
                          audio: { echoCancellation: true },
                        }, // This is an audio only room
                        success: function (jsep) {
                          Janus.debug("Got SDP!", jsep);
                          var muted = true;
                          if (
                            self.state.reloadParams &&
                            self.state.reloadParams["mic"]
                          ) {
                            muted = false;
                          }
                          var publish = { request: "configure", muted: muted };
                          self.state.mixertest.send({
                            message: publish,
                            jsep: jsep,
                          });
                        },
                        error: function (error) {
                          Janus.error("WebRTC error:", error);
                        },
                      });
                    }
                  }
                  // Any room participant?
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    Janus.debug("Got a list of participants:", list);
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      self.addParticipant(list[f]["id"], list[f]["display"]);
                    }
                  }
                } else if (event === "roomchanged") {
                  // The user switched to a different room
                  self.setState({
                    myid: msg["id"],
                  });
                  Janus.log(
                    "Moved to room " +
                      msg["room"] +
                      ", new ID: " +
                      self.state.myid
                  );
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    console.log(">>>>>>>>>>>>>>>");
                    console.log("Got a list of participants:", list);
                    for (var f in list) {
                      console.log(list[f]);
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      var role = self.currentRole();
                      self.addParticipant(
                        msg["id"],
                        self.state.fullname +
                          "§" +
                          self.state.userUUID +
                          "§" +
                          self.state.userColor +
                          "§" +
                          self.state.initials +
                          "§" +
                          role
                      );

                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (setup=" +
                          setup +
                          ", muted=" +
                          muted +
                          ")"
                      );
                    }
                  }
                } else if (event === "destroyed") {
                  // The room has been destroyed
                  Janus.warn("The room has been destroyed!");
                } else if (event === "event") {
                  if (msg["participants"]) {
                    var list = msg["participants"];
                    Janus.debug("Got a list of participants:", list);
                    for (var f in list) {
                      console.log(list[f]);
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var setup = list[f]["setup"];
                      var muted = list[f]["muted"];
                      var talking = list[f]["talking"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (setup=" +
                          setup +
                          ", muted=" +
                          muted +
                          ")"
                      );

                      if (talking) {
                        //console.log("%%%%%%%%",list[f]["id"],"is talking ...");
                      }
                      if (muted) {
                        self.participantChangeStatus(list[f]["id"], false);
                      }
                      self.addParticipant(list[f]["id"], list[f]["display"]);
                    }
                  } else if (msg["error"]) {
                    if (msg["error_code"] === 485) {
                      // This is a "no such room" error: give a more meaningful description
                    } else {
                    }
                    return;
                  }
                  // Any new feed to attach to?
                  if (msg["leaving"]) {
                    // One of the participants has gone away?
                    var leaving = msg["leaving"];
                    self.removeParticipant(leaving);
                    Janus.log(
                      "Participant left: " +
                        leaving +
                        " elements with ID #rp" +
                        leaving +
                        ")"
                    );
                    //$('#rp' + leaving).remove();
                  }
                }
              }
              if (jsep) {
                Janus.debug("Handling SDP as well...", jsep);
                self.state.mixertest.handleRemoteJsep({ jsep: jsep });
              }
            },
            onlocalstream: function (stream) {
              Janus.debug(" ::: Got a local stream :::", stream);
              self.setState({ localStream: stream });
            },
            onremotestream: function (stream) {
              if ($("#roomaudio").length === 0) {
                $("#mixedaudio").append(
                  '<audio class="rounded centered" id="roomaudio" width="100%" height="100%" autoplay/>'
                );
                Janus.attachMediaStream(
                  document.getElementById("roomaudio"),
                  stream
                );
                self.setState({ remoteStream: stream });
              }
            },
            oncleanup: function () {
              Janus.log(" ::: Got a cleanup notification :::");
            },
          });
        },
        error: function (error) {},
        destroyed: function () {
          window.location.reload();
        },
      });
    },
  });
}

export function registerUsername(room) {
  var self = this;
  var role = this.currentRole();
  var register = {
    request: "join",
    room: parseInt(room),
    pin: self.state.pin,
    // secret: self.state.secret,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" +
      self.state.initials +
      "§" +
      role,
  };
  self.state.mixertest.send({ message: register });
  self.setState({ myId: self.state.mixertest.id, role: role });
}

export function changeUsername(room) {
  var self = this;
  var role = this.currentRole();
  console.log("changing role to ..", role, parseInt(room));
  var register = {
    request: "configure",
    //room: parseInt(room),
    //pin: self.state.vpin,
    display:
      self.state.fullname +
      " §" +
      self.state.userUUID +
      "§" +
      self.state.userColor +
      "§" +
      self.state.initials +
      "§" +
      role,
  };
  //console.log("changing role to ..", role, parseInt(room), register);
  self.state.mixertest.send({ message: register });
  self.setState({ myId: self.state.mixertest.id, role: role });
  self.changeOwn(self.state.userUUID, role);
}

export function currentRole() {
  var role = "listener";
  if (this.state.is_speaker) {
    role = "speaker";
  }
  if (this.state.is_presenter) {
    role = "presenter";
  }
  if (this.state.is_moderator) {
    role = "moderator";
  }
  return role;
}

export function removeParticipant(id) {
  var self = this;
  self.setState({
    participants: self.state.participants.filter((item) => item.id !== id),
  });
}

export function addParticipant(id, p) {
  var self = this;
  var participant = p.split("§");
  if (participant.length > 4 && this.exisitingParticipant(participant[1])) {
    self.setState({
      participants: self.state.participants.concat({
        id: id,
        display: participant[0],
        uuid: participant[1],
        userColor: participant[2],
        initials: participant[3],
        role: participant[4],
        current: "stopped-talking",
      }),
    });
  } else {
    self.changeParticipant(id, p);
  }
  //console.log("Adding Participants ...", participant[0], participant[4]);
}

export function exisitingParticipant(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return true;
  } else {
    return false;
  }
}

export function changeOwn(uuid, role){
  var self = this;
  var exisiting = self.state.participants.filter(
    (item) => item.uuid === uuid
  );
  if(exisiting && exisiting.length > 0) {
    self.setState(
      {
        participants: self.state.participants.filter(
          (item) => item.uuid !== uuid
        ),
      },
      () => { 
        exisiting[0]['role'] = role
        self.setState({
          participants: self.state.participants.concat(exisiting[0]) 
        })
      })
  }
}

export function changeParticipant(id, p) {
  var self = this;
  var participant = p.split("§");
  if (participant[1] && participant[4]) {
    console.log('%%%%%%%', participant[1], id)
    self.setState(
      {
        participants: self.state.participants.filter(
          (item) => item.uuid !== participant[1]
        ),
      },
      () => {
        self.setState({
          participants: self.state.participants.concat({
            id: id,
            display: participant[0],
            uuid: participant[1],
            userColor: participant[2],
            initials: participant[3],
            role: participant[4],
            current: "stopped-talking",
          }),
        });
      }
    );
    console.log("Adding Participants ...", participant[0], participant[4]);
  }
}

export function participantDisplay(participantId) {
  var self = this;
  var exisiting = self.state.participants.filter(
    (item) => item.uuid === participantId
  );
  if (exisiting.length === 0) {
    return "";
  } else {
    return exisiting[0].display;
  }
}

export function participantChangeStatus(participantId, status) {
  this.setState((prevState) => ({
    talking: {
      ...prevState.talking,
      [participantId]: status,
    },
  }));
}

export function participantChangeRoom(participantId, room) {
  this.setState((prevState) => ({
    participantRoom: {
      ...prevState.participantRoom,
      [participantId]: room,
    },
  }));
}

export function toggleMute() {
  var self = this;

  this.setState({ muted: !this.state.muted }, () => {
    self.state.mixertest.send({
      message: { request: "configure", muted: self.state.muted },
    });
    if (this.state.muted) {
      $("#microphone-on").show();
      $("#microphone-off").hide();
      $("#microphone-off").css("color", "initial");
    } else {
      $("#microphone-off").show();
      $("#microphone-off").css("color", "black");
      $("#microphone-on").hide();
    }
    console.log("muted", this.state.muted, this.state.myId);
  });

  //if(self.state.muted){
  self.participantChangeStatus(this.state.myId, false);
  //}
}

export function forceMute() {
  var self = this;

  this.state.mixertest.send({
    message: { request: "configure", muted: true },
  });
  self.participantChangeStatus(this.state.myId, false);
}

export function exitAudioRoom() {
  var self = this;
  console.log("exitAudioRoom");
  if (this.state.mixertest) {
    console.log("exitAudioRoom");
    this.state.mixertest.send({ message: { request: "leave" } });
  }
}
