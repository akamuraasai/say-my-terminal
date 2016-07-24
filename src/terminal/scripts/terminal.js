$(document).ready(init);

var user = "akamuraasai@myportfolio";
var dir = "~";
var actions = [];
var action = 0;
var container = $("div.input-container");
var commands =
[
  {
    "command": "cd",
    "output": "yeah, that's the way.",
    "function": "console.log(arguments); return arguments[0][arguments[0].length-1];"
  },
  {
    "command": "rm",
    "output": "really nigga?",
    "function": "console.log(arguments); return arguments[0][arguments[0].length-1];"
  },
  {
    "command": "clear",
    "output": "",
    "function": "container.html(''); return '';"
  }
];

var writeText = function (text) {
  var line = actualLine();
  var theater = theaterJS();

  theater
  .on('type:end', function () {
    // and then remove it when he's done
    if (actions.length - 1 > action) returnPress();
    else returnPress(false);
  })
    .addActor('typing', {}, 'div.input-container .input-line:last-child .input-text')
    .addScene(text,100);
}

var actualLine = function () {
  return $("div.input-container .input-text").last();
}

var newLineRO = function () {
  return '<div class="input-line" data-usr="'+user+'" data-dir="'+dir+'"><span class="input-text"></span></div>';
}

var newLine = function () {
  return '<div class="input-line" data-usr="'+user+'" data-dir="'+dir+'"><input type="text" class="input-text" autofocus></div>';
}

var newOutputLine = function (text) {
  return '<div class="output-line"><span class="output-text">'+text+'</span></div>';
}

var newOutputLineCmd = function (cmd) {
  var output = getOutput(cmd);
  return '<div class="output-line"><span class="output-text">'+output+'</span></div>';
}

var getOutput = function (cmd) {
  var line = cmd.split(" "),
      program = line[0],
      params = line;

  var result = $.grep(commands, function(e){ return e.command == program; });

  if (result.length == 0) return "Error command not found, you jerk.";
  else {
    return runCommands(result[0].function, params, result[0].output)
  }
}

var runCommands = function (func, params, output) {
  var tmpFunc = new Function(func);
  params.push(output);
  return tmpFunc(params);
}

var returnPress = function (readonly = true, input = false, command = "") {
  changeLine();

  if (input) container.append(newOutputLineCmd(command)).append("<br>");
  else container.append(newOutputLine(actions[action].output)).append("<br>");

  if (readonly) container.append(newLineRO);
  else container.append(newLine).find(".input-text").last().focus();

  var nextAction = setInterval(function () {
    action++;
    if (actions.length > action) writeText("typing:"+actions[action].command);
    clearInterval(nextAction);
  }, 500);

}

var changeLine = function () {
  $("div.input-container .input-text").last().attr("readonly", "");
}

$(document).on('keyup', 'input.input-text:not([readonly])', function(e) {
  // console.log(e.originalEvent.code);
  var command = $("div.input-container .input-line:last-child .input-text").val();
  if (e.originalEvent.code == 'Enter') returnPress(false, true, command);
});

function init()
{
  actions.push({"command": "ls -l", "output": "not this time, fella."});
  actions.push({"command": "cd Documents", "output": "better luck next time."});
  writeText("typing:"+actions[action].command);
}
