import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('redirect')
@Controller('')
export class RedirectController {
  @Get('/bug')
  async bug(@Res() res: Response) {
    res.redirect('https://forms.gle/R6vrPeokJqfB3gCR8');
  }

  @Get('/addmusic')
  async addmusic(@Res() res: Response) {
    res.redirect(
      'https://docs.google.com/spreadsheets/d/1n8bRCE_OBUOND4pfhlqwEBMR6qifVLyWk5YrHclRWfY',
    );
  }

  @Get('/privacy')
  async privacy(@Res() res: Response) {
    res.redirect(
      'https://www.notion.so/waktaverse/ddca30a20d634ff68d41d20957439bd5',
    );
  }

  @Get('/app/ios')
  async appIos(@Res() res: Response) {
    res.redirect('https://apps.apple.com/app/billboardoo/id1641642735');
  }

  @Get('/app/android')
  async appAndroid(@Res() res: Response) {
    res.redirect(
      'https://play.google.com/store/apps/details?id=com.waktaverse.music',
    );
  }
}
