import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): SafeHtml {
    if (!value) return value;

    // Regular expression to match @username and #channel
    const mentionPattern = /(@[\p{L}\w]+(?:\s[\p{L}\w]+)?|#[\p{L}\w]+(?:\s[\p{L}\w]+)?)/gu;

    // Replace mentions with spans
    const transformed = value.replace(mentionPattern, (match) => {
      const mention = match.slice(1); // Remove @ or #
      let isValid = false;

      // Check if it’s a valid user or channel
      if (match.startsWith('@')) {
        isValid = this.userService.isValidUser(mention); // Check if valid user
      } else if (match.startsWith('#')) {
        isValid = this.channelService.isValidChannel(mention); // Check if valid channel
      }

      // Return the span if it's valid, otherwise return the mention as it is
      return isValid ? `<span class="highlighted" data-mention="${match}">${match}</span>` : match;
    });

    return this.sanitizer.bypassSecurityTrustHtml(transformed);
  }
}