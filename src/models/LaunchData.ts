import { jsonProperty } from '../JsonConvert';

class LaunchData {
  @jsonProperty('ln_chk_name')
  public frostPath: string;

  @jsonProperty('ln_name')
  public frostLauncher: string;

  @jsonProperty('ln_type')
  public launchType: number;

  @jsonProperty('ln_params')
  public launchParams: string;
}

export default LaunchData;
