# v2-wireless-client

Node module to sniff around for any scent of sensors and then send or save their data

## Install

```
npm install
sqlite3 sensor_events.db < sensor_events_db.schema
```


## Run

```
NODE_ENV=development node scanner.js
```


## Debug

```
// use debugger; somewhere in your code
// type c when presented with debug interface (to run the program)
// type repl when you hit the debugger breakpoint to get access to vars etc

NODE_ENV=development node debug scanner.js
```


# Raspberry setup

We use ansible for managing raspberries


**Setup SSH Auth**

```
ansible-playbook -i ansible/hosts ansible/auth.yml --ask-pass --sudo
```


**Install the App**

```
ansible-playbook -i ansible/hosts ansible/setup.yml
```
