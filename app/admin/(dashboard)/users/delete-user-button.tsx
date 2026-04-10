"use client";

import { deleteUser } from "@/actions/users";

type Props = {
  userId: string;
  email: string;
};

export function DeleteUserButton({ userId, email }: Props) {
  return (
    <form
      action={deleteUser.bind(null, userId)}
      onSubmit={(e) => {
        if (
          !confirm(
            `Remove ${email} from the portal? This cannot be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200/80 bg-white px-3 py-2 text-[12px] font-medium text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-50"
        title="Remove user"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        Remove
      </button>
    </form>
  );
}
