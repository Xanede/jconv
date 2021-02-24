import { jsonProperty } from '../../src/JsonConvert';
import Reply from './Reply';

class Post {
  @jsonProperty('id')
  public id: number;

  @jsonProperty('title')
  public title: string;

  @jsonProperty('text')
  public content: string;

  @jsonProperty('media_link_photo')
  public imageUrl: string;

  @jsonProperty('tags', [])
  public tags: string[];

  public get tagsAsText() {
    return this.tags.join();
  }

  @jsonProperty('replies', [Reply])
  public replies: Reply[];

  @jsonProperty('publication_date', Date)
  public publicationDate: Date;
}

export default Post;
