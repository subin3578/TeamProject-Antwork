import { create } from "zustand";

export const channelStore = create((set) => ({
  channels: [],
  setChannels: (channels) => set({ channels: channels }),
  addChannel: (channel) =>
    set((state) => ({ channels: [...state.channels, channel] })),
  removeChannel: (channelId) =>
    set((state) => ({
      channels: state.channels.filter((channel) => channel.id !== channelId),
    })),
}));
