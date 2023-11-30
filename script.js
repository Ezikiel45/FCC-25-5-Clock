function App() {
  const [timer, setTimer] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timeType, setTimeType] = React.useState("session");
  const [playing, setPlaying] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);

  /* Play's audio. Test requires id tag so I just made an element instead. This is another way of doing the same thing without <audio />.
  
  const [breakSound, setBreakSound] = React.useState(new Audio("https://actions.google.com/sounds/v1/alarms/bugle_tune.ogg"));
  */

  // Ref <audio /> element from return statement. Reset the audio then play it. 

  const playAudio = () => {
    playBeep.currentTime = 0;
    playBeep.play();

    // Play new Audio created as const above.

    //breakSound.currentTime = 0;
    //breakSound.play();

  };

  // Takes time in seconds and converts to mm:ss format for the timer box. If times are for break or session Length fields it only returns the minutes. 

  const formatClock = (time, timeType) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (timeType === 'session' || timeType === 'break') {
      return (
        minutes);

    }

    return (

      (minutes >= 10 ? minutes : "0" + minutes) +
      ":" + (
      seconds >= 10 ? seconds : "0" + seconds));

  };

  // When pressing an up or down button, determines which timeType it's assigned to an increase the length by 1 minute. If length <= 1 or length >= 60 prevents going under 1 or over 60. If the timer is paused changing the time will update the timer. If timer is playing the time will keep counting down from prev time and length of altered time will remain the same.

  const changeTime = (type, amount) => {
    if (type == "break") {
      if (
      breakTime <= 60 && amount < 0 ||
      breakTime >= 3600 && amount > 0)
      {
        return;
      }
      if (!playing) {
        setBreakTime(prev => prev + amount);
      }
      if (!playing && onBreak) {
        setTimer(breakTime + amount);
      }
    } else {
      if (
      sessionTime <= 60 && amount < 0 ||
      sessionTime >= 3600 && amount > 0)
      {
        return;
      }
      if (!playing) {
        setSessionTime(prev => prev + amount);
      }
      if (!playing) {
        setTimer(sessionTime + amount);
      }
    }
  };

  // Reset to initial state.

  const resetClock = () => {
    setTimer(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    setPlaying(false);
    setTimeType("session");
    setOnBreak(false);
    playBeep.pause();
    playBeep.currentTime = 0;
  };

  // Date.getTime ensures time doesn't drift. Onbreak is condition check to switch timer between two timeTypes. Interval is stored in local state and replaced every iteration. If playing and function called, interval is cleared so a new one can be made next time play is pressed. Checks and returns appropriate timeType.

  const handleTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let isOnBreak = onBreak;

    if (!playing) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setTimer(time => {
            if (time == 1) {
              playAudio();
            } else
            if (time == 0) {
              if (time <= 0 && !isOnBreak) {
                setOnBreak(true);
                isOnBreak = true;
                setTimeType('break');
                return breakTime;
              } else
              if (time <= 0 && isOnBreak) {
                setOnBreak(false);
                isOnBreak = false;
                setTimeType('session');
                return sessionTime;
              }
            }
            return time - 1;
          });
          nextDate += second;
        }
      }, 1000);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (playing) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setPlaying(!playing);
  };


  return /*#__PURE__*/(
    React.createElement("div", { className: "app-container" }, /*#__PURE__*/
    React.createElement("div", { className: "alter-container" }, /*#__PURE__*/
    React.createElement(Length, {
      title: "Break Length",
      changeTime: changeTime,
      timeType: "break",
      time: breakTime,
      formatClock: formatClock }), /*#__PURE__*/


    React.createElement(Length, {
      title: "Session Length",
      changeTime: changeTime,
      timeType: "session",
      time: sessionTime,
      formatClock: formatClock })), /*#__PURE__*/


    React.createElement("div", { className: "timer-container" }, /*#__PURE__*/
    React.createElement("h1", { id: "timer-label", className: "timer-label" },
    timeType == 'session' ? 'Session' : 'Break'), /*#__PURE__*/

    React.createElement("div", { id: "time-left", className: "time-left" },
    formatClock(timer, { timeType }))), /*#__PURE__*/


    React.createElement("div", { className: "control-container" }, /*#__PURE__*/
    React.createElement("button", {
      onClick: () => handleTime(),
      id: "start_stop",
      className: "play-button control" },

    !playing ? "Play" : "Pause"), /*#__PURE__*/

    React.createElement("button", {
      onClick: () => !playing ? resetClock() : [handleTime(), resetClock()],
      id: "reset",
      className: "reset-button control" }, "Reset")), /*#__PURE__*/




    React.createElement("audio", {
      id: "beep",
      preload: "auto",
      ref: audio => {playBeep = audio;}, src: "https://actions.google.com/sounds/v1/alarms/beep_short.ogg" })));



}

function Length({ title, changeTime, timeType, time, formatClock }) {
  return /*#__PURE__*/(
    React.createElement("div", null, /*#__PURE__*/
    React.createElement("h3", {
      id: `${timeType}-label`,
      className: "length-label" },

    title), /*#__PURE__*/

    React.createElement("div", { className: "alter" }, /*#__PURE__*/
    React.createElement("button", {
      className: "alter-buttons down",
      id: `${timeType}-decrement`,
      onClick: () => changeTime(timeType, -60) }, /*#__PURE__*/

    React.createElement("i", { class: "fa-solid fa-arrow-down" })), /*#__PURE__*/

    React.createElement("p", {
      id: `${timeType}-length`,
      className: "time-length" },

    formatClock(time, timeType)), /*#__PURE__*/

    React.createElement("button", {
      className: "alter-buttons up",
      id: `${timeType}-increment`,
      onClick: () => changeTime(timeType, 60) }, /*#__PURE__*/

    React.createElement("i", { class: "fa-solid fa-arrow-up" })))));




}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));