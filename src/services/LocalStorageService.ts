import localServiceKeys from './const/LocalServiceKeys';

export default class LocalStorageService {
  static clearWorkedSeconds() {
    localStorage.setItem(localServiceKeys.workedSeconds, JSON.stringify(0));
  }

  static storeWorkedSeconds(workTime: number) {
    localStorage.setItem(
      localServiceKeys.workedSeconds,
      JSON.stringify(workTime)
    );
  }

  static clearSecondsPaused() {
    localStorage.setItem(localServiceKeys.secondsPaused, JSON.stringify(0));
  }

  static clearIsPausing() {
    localStorage.setItem(localServiceKeys.isPausing, JSON.stringify(false));
  }

  static clearLatestPausedAt() {
    localStorage.setItem(localServiceKeys.latestPausedAt, JSON.stringify(null));
  }

  static getPausedSecondsDifference(): number {
    const previousSecondsPaused = localStorage.getItem(
      localServiceKeys.secondsPaused
    );
    if (!previousSecondsPaused) {
      return 0;
    }
    const latestPausedAt = localStorage.getItem(
      localServiceKeys.latestPausedAt
    );
    if (!latestPausedAt) {
      return 0;
    }
    const parsedLatestPausedAt = JSON.parse(latestPausedAt);
    if (!parsedLatestPausedAt) {
      return 0;
    }

    const latestPausedAtTimestamp = new Date(parsedLatestPausedAt).getTime();
    const currentTimestamp = new Date().getTime();
    const differenceInSeconds =
      (currentTimestamp - latestPausedAtTimestamp) / 1000;
    return Math.floor(differenceInSeconds);
  }

  static getSecondsPaused(): number {
    const previousSecondsPaused = localStorage.getItem(
      localServiceKeys.secondsPaused
    );
    if (!previousSecondsPaused) {
      return 0;
    }
    const parsedPreviousSecondsPaused = JSON.parse(previousSecondsPaused);
    return Math.floor(parsedPreviousSecondsPaused);
  }

  static getSecondsPausedUntilNow(): number {
    const previousSecondsPaused = localStorage.getItem(
      localServiceKeys.secondsPaused
    );
    if (!previousSecondsPaused) {
      return 0;
    }
    const parsedPreviousSecondsPaused = JSON.parse(previousSecondsPaused);
    const pausedSecondsDifference = LocalStorageService.getPausedSecondsDifference();
    return Math.floor(parsedPreviousSecondsPaused + pausedSecondsDifference);
  }

  static getIsPausing(): boolean {
    const isPausing = localStorage.getItem(localServiceKeys.isPausing);
    if (!isPausing) {
      return false;
    }
    return JSON.parse(isPausing);
  }

  static storeLatestPausedAt(): Date {
    const now = new Date(Date.now());
    localStorage.setItem(localServiceKeys.latestPausedAt, JSON.stringify(now));
    return now;
  }

  static storeSecondsPaused(secondsPaused: number): void {
    localStorage.setItem(
      localServiceKeys.secondsPaused,
      JSON.stringify(secondsPaused)
    );
  }

  static storeIsPausing(isPausing: boolean): void {
    localStorage.setItem(localServiceKeys.isPausing, JSON.stringify(isPausing));
  }

  static clearWorkTime(): void {
    localStorage.setItem(localServiceKeys.startWork, JSON.stringify(0));
  }

  public static storeStartWorkTime(): Date {
    const now = new Date(Date.now());
    localStorage.setItem(localServiceKeys.startWork, JSON.stringify(now));
    return now;
  }

  public static getStartWorkTime(): number {
    const startWork = localStorage.getItem(localServiceKeys.startWork);
    const storedIsPausing = LocalStorageService.getIsPausing();

    if (!startWork) {
      return 0;
    }

    const parsedStartWork = JSON.parse(startWork);
    if (!parsedStartWork) {
      return 0;
    }

    if (storedIsPausing) {
      return LocalStorageService.getWorkedSeconds();
    }

    const startWorkDate: Date = new Date(parsedStartWork);
    const currentTimestamp = new Date().getTime();
    const startWorkTimestamp = startWorkDate.getTime();

    const differenceInSeconds = (currentTimestamp - startWorkTimestamp) / 1000;
    return Math.floor(differenceInSeconds);
  }

  static getWorkedSeconds(): number {
    const workedSeconds = localStorage.getItem(localServiceKeys.workedSeconds);
    if (!workedSeconds) {
      return 0;
    }
    return JSON.parse(workedSeconds);
  }
}
