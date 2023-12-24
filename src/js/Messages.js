import { ajax } from "rxjs/ajax";
import { take, map, catchError, of, interval } from "rxjs";
import moment from "moment";

export default class Messages {
  constructor() {
    this.list = document.querySelector(".list-messages");
  }

  init() {
    const numbers = interval(1000).pipe(take(7));
    const a = numbers.subscribe((x) => {
      const obs$ = ajax.getJSON("https://rxjs-back.onrender.com/messages/unread").pipe(
        catchError((error) => {
          console.log("error: ", error);
          return of(error);
        })
      );

      obs$.subscribe(
        (response) => {
          this.addToList(response);
        },
        (error) => {
          throw new Error(error);
        }
      );
    });
  }

  addToList(data) {
    const formattedTime = moment.unix(data.received).format("HH:mm YYYY-MM-DD");
    const formattedSender = data.from.slice(0, data.from.indexOf("@"));
    let formattedText = data.subject;
    if (formattedText.length >= 15) {
      formattedText = data.subject.slice(0, 15) + "...";
    }

    const maket = `
    <div class="message">
      <div class="message-sender">${formattedSender}</div>
      <div class="message-text">${formattedText}</div>
      <div class="message-time">${formattedTime}</div>
    </div>`;

    this.list.insertAdjacentHTML("afterbegin", maket);
  }
}
