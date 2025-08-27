export interface PedParams {
  crossingAt: number; // position along lane where crossing is
}

export interface PedState {
  waiting: number; // count
  crossing: number; // count
}

export function updatePedestrians(
  state: PedState,
  dtSec: number,
  pedGreen: boolean
) {
  // MVP: simple stochastic arrival and service when green
  const arrivalRatePerSec = 0.2; // 12 per min
  state.waiting += Math.random() < arrivalRatePerSec * dtSec ? 1 : 0;

  if (pedGreen) {
    const serviceRatePerSec = 1.5; // how many can cross per second
    const served = Math.min(state.waiting, Math.floor(serviceRatePerSec * dtSec));
    state.waiting -= served;
    state.crossing += served;
  } else {
    // when not green, crossing completes gradually
    state.crossing = Math.max(0, state.crossing - dtSec);
  }
}
