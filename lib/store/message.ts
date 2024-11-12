import { create } from "zustand";

export type Imessage = {
	created_at: string;
	id: string;
	is_edit: boolean;
	send_by: string;
	text: string;
	users: {
		avatar_url: string;
		created_at: string;
		display_name: string;
		id: string;
	} | null;
};

interface MessageState {
	hasMore: boolean;
	page: number;
	messages: Imessage[];
	actionMessage: Imessage | undefined;
	optimisticIds: string[];
	addMessage: (message: Imessage) => void;
	setActionMessage: (message: Imessage | undefined) => void;
	optimisticDeleteMessage: (messageId: string) => void;
	optimisticUpdateMessage: (message: Imessage) => void;
	setOptimisticIds: (id: string) => void;
	setMesssages: (messages: Imessage[]) => void;
}

export const useMessage = create<MessageState>()((set) => ({
	hasMore: true,
	page: 1,
	messages: [],
	optimisticIds: [],
	actionMessage: undefined,
	setMesssages: (messages) =>
		set((state) => ({
			messages: [...messages, ...state.messages],
			page: state.page + 1,
		})),
	setOptimisticIds: (id: string) =>
		set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
	addMessage: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, newMessages],
		})),
	setActionMessage: (message) => set(() => ({ actionMessage: message })),
	optimisticDeleteMessage: (messageId) =>
		set((state) => {
			return {
				messages: state.messages.filter(
					(message) => message.id !== messageId
				),
			};
		}),
	optimisticUpdateMessage: (updateMessage) =>
		set((state) => {
			return {
				messages: state.messages.filter((message) => {
					if (message.id === updateMessage.id) {
						(message.text = updateMessage.text),
							(message.is_edit = updateMessage.is_edit);
					}
					return message;
				}),
			};
		}),
}));