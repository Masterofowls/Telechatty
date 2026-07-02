import {
  DefaultAttachmentData,
  DefaultChannelData,
  DefaultCommandData,
  DefaultEventData,
  DefaultMemberData,
  DefaultMessageData,
  DefaultPollData,
  DefaultPollOptionData,
  DefaultReactionData,
  DefaultThreadData,
  DefaultUserData,
} from 'stream-chat-expo';

declare module 'stream-chat' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomAttachmentData extends DefaultAttachmentData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomChannelData extends DefaultChannelData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomCommandData extends DefaultCommandData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomEventData extends DefaultEventData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomMemberData extends DefaultMemberData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomUserData extends DefaultUserData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomMessageData extends DefaultMessageData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomPollOptionData extends DefaultPollOptionData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomPollData extends DefaultPollData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomReactionData extends DefaultReactionData {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface CustomThreadData extends DefaultThreadData {}
}
