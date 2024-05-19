import { User } from './src/users/entities/user.entity';
import { Wish } from './src/wishes/entities/wish.entity';
import { Wishlist } from './src/wishlists/entities/wishlist.entity';
import { Offer } from './src/offers/entities/offer.entity';

export default {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'kupipodariday',
  entities: [User, Wish, Wishlist, Offer],
  migrations: ['database/migrations/*.js'],
  synchronize: true,
};
