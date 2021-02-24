import { jsonProperty } from '../../src/JsonConvert';

class Reply {
  @jsonProperty('author')
  public author: number;

  @jsonProperty('text')
  public message: string;

  @jsonProperty('publication_date', Date)
  public date: Date;
}

export default Reply;
