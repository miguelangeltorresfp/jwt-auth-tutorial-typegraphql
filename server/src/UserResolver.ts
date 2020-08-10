import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from 'type-graphql';
import { User } from './entity/User';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<LoginResponse> {
    // Verify that the user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('Could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('Bad password');
    }

    // Login successful

    return {
      accessToken: sign({ userId: user.id }, 'secret', { expiresIn: '15m' }),
    };
  }
}
