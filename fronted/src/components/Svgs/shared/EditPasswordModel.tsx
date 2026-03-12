import { useMutation } from "@tanstack/react-query";
import { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { UseUpdatePassword } from "../../../Apis.tsx";
import LoadingSpinner from "../../LoadingSpinner.tsx";
import { useAppSelector } from "../../../hooks/useStore.ts";

const ChangePasswordModal = () => {
  const { userData } = useAppSelector(state => state.auth);
  const token = userData?.data?.accessToken;
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mutation
  const { mutate: changePass, isPending, isError, error } = useMutation({
    mutationFn: (data: typeof formData) => UseUpdatePassword(data, token || ""),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setTimeout(() => dialogRef.current?.close(), 150);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to change password");
    },
  });

  // Handlers with useCallback
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      changePass(formData);
    },
    [formData, changePass]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const openDialog = useCallback(() => dialogRef.current?.showModal(), []);

  return (
    <>
      <button
        className="btn btn-outline rounded-full btn-sm mr-3"
        disabled={isPending}
        onClick={openDialog}
      >
        Change Password
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Change Password</h3>

          <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Hidden username input for autofill */}
            <input type="text" name="username" autoComplete="username" style={{ display: "none" }} />

            <input
              type="password"
              placeholder="Current password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />

            <input
              type="password"
              placeholder="New password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />

            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input input-bordered"
              required
            />

            <button className="btn btn-primary">
              {isPending ? <LoadingSpinner /> : "Update Password"}
            </button>

            {isError && error instanceof Error && (
              <p className="text-red-500 text-xs">{error.message}</p>
            )}
          </form>
        </div>
      </dialog>
    </>
  );
};

export default ChangePasswordModal;