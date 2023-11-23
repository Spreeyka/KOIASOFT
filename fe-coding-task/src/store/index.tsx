/* eslint-disable react-hooks/rules-of-hooks */
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";

export type Stat = string;

export type Comment = {
  id: string;
  statUrl: string;
  text: string;
};

type State = {
  comments: Comment[];
  savedStats: Stat[];
};

type Actions = {
  commentAdded: (comment: Comment) => void;
  commentTextEdited: (commentId: string, newText: string) => void;
  statToggledAsFavorite: (statPath: string) => void;
};

const useStore = create<State & Actions>()(
  immer((set) => ({
    comments: [],
    savedStats: [],
    commentAdded: (comment) =>
      set((state) => {
        state.comments.unshift(comment);
      }),
    commentTextEdited: (commentId, newText) =>
      set((state) => {
        const commentToUpdate = state.comments.find((comment) => comment.id === commentId);

        if (commentToUpdate) {
          commentToUpdate.text = newText;
        }
      }),
    statToggledAsFavorite: (statPath) =>
      set((state) => {
        const isFavorite = state.savedStats.includes(statPath);

        if (isFavorite) {
          state.savedStats = state.savedStats.filter((_statPath) => _statPath !== statPath);
        } else {
          state.savedStats.push(statPath);
        }
      }),
  }))
);

export { useStore };
