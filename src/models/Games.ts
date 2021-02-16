import { jsonProperty } from '../JsonConvert';
import Game from './Game';

class Games {
  @jsonProperty('games', [Game])
  public games: Game[];
}

export default Games;
