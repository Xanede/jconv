import { jsonProperty } from '../JsonConvert';
import LaunchData from './LaunchData';

class Game {
  @jsonProperty('id')
  public id: number;

  @jsonProperty('name')
  public name: string;

  @jsonProperty('display_name')
  public displayName: string;

  @jsonProperty('key_new')
  public key: string;

  @jsonProperty('type')
  public type: string;

  public get envKey() {
    return `${this.key}_${this.type}`;
  }

  @jsonProperty('base_url')
  public baseUrl: string;

  @jsonProperty('release_date', Date)
  public release: Date;

  @jsonProperty('ln_data', LaunchData)
  public launchData: LaunchData;
}

export default Game;
