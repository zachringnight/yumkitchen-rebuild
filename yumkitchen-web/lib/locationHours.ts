const centralTimeZone = 'America/Chicago';
const opensAtMinutes = 8 * 60;
const closesAtMinutes = 20 * 60;

export type OpenStatus = {
  open: boolean;
  label: string;
  detail: string;
};

function centralMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: centralTimeZone,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return hour * 60 + minute;
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const minutes = centralMinutes(date);

  if (minutes >= opensAtMinutes && minutes < closesAtMinutes) {
    return {
      open: true,
      label: 'Open now',
      detail: 'until 8pm',
    };
  }

  if (minutes < opensAtMinutes) {
    return {
      open: false,
      label: 'Closed now',
      detail: 'opens at 8am',
    };
  }

  return {
    open: false,
    label: 'Closed now',
    detail: 'opens tomorrow at 8am',
  };
}
