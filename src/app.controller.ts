import { UsersService } from './users/users.service';
import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
// import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private authService: AuthService,
		private usersService: UsersService,
	) {
		console.log(usersService);
	}

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Req() req: Request, @Res() res: Response) {
		const token = this.authService.login(req.user);
		console.log(token);
		res.cookie('access_token', token, {
			httpOnly: true,
			domain: 'localhost',
			expires: new Date(Date.now() + 1000 * 60),
		}).send({ success: true });
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Req() req: Request) {
		return req.user;
	}
}
