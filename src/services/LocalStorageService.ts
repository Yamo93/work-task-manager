export default class LocalStorageService {
  static clearWorkTime() {
    localStorage.setItem('start-work', JSON.stringify(0));
  }

  public static storeStartWorkTime(): Date {
    const now = new Date(Date.now());
    localStorage.setItem('start-work', JSON.stringify(now));
    return now;
  }

  public static getStartWorkTime(): number {
    const startWork = localStorage.getItem('start-work');

    if (!startWork) {
      return 0;
    }
    const parsedStartWork = JSON.parse(startWork);
    if (!parsedStartWork) {
      return 0;
    }

    const startWorkDate: Date = new Date(parsedStartWork);
    const currentTimestamp = new Date().getTime();
    const startWorkTimestamp = startWorkDate.getTime();

    const differenceInSeconds = (currentTimestamp - startWorkTimestamp) / 1000;
    return Math.floor(differenceInSeconds);
  }
}
