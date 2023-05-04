[x] Key mapping
[x] Listen for combination
[ ] Error handling
[ ] Native app

---
- `listen` to listen to keyboard events on a port (like socket)
- `grab` to grab keyboard event globably
- `serialize` to serialize event data


---
Couldn't run grab function. Encounter this error: Os { code: 13, kind: PermissionDenied, message: "Permission denied" }
Resolved by add `input` and `plugdev` into current user's group. Reboot after change


---
question: how to record combination keybind on global. We need some kind of keypress/keyrelease controller
Enum `EventType` has `KeyPress` and `KeyRelease`. What can we do with it?
Create vec[] of `eventData` that will be appended based on EventType:
- `EventType::KeyPress`: append event into vec
- `EventType::KeyRelease`: End of recording -> pop the according event
At the end of the release state, if vec[] is empty then emit the action regards to the recorded combination

- Restriction:
    + Only record a key that is not being pressed or a key that is already released.
    + Do not emit action while a key is pressed.
    + Only put on listening mode if a special key (control, shift, cmd) is pressed. Otherwise, ignore

Or let's reconsider:
We just need to map Ctrl to Cmd. This is a hacky way but not the right way. Map one key will possible break different combination. eg: _Control-Command-F: Use the app in full screen, if supported by the app._ will become _Command-Command-F_

---
Create a mapper list. Record combination will reflect on that list to decide whether mapping or not.
https://docs.rs/lazy_static/1.4.0/lazy_static/