/* eslint-disable react-hooks/rules-of-hooks */
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface statData {
  date: string;
  price: number;
}

export type Stat = { path: string; data: statData[] };

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
  statToggledAsFavorite: (stat: Stat) => void;
};

const useStore = create<State & Actions>()(
  persist(
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
      statToggledAsFavorite: (stat) =>
        set((state) => {
          const isFavorite = state.savedStats.find((_stat) => _stat.path === stat.path);

          if (isFavorite) {
            state.savedStats = state.savedStats.filter((_stat) => _stat.path !== stat.path);
            return;
          }
          state.savedStats.push(stat);
        }),
    })),
    {
      name: "dwelling-prices-app",
    }
  )
);

export { useStore };
