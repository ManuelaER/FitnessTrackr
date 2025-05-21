import React, { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";

export default function Activities() {
  const { token } = useAuth();
  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  const {
    mutate: deleteActivity,
    loading: deleting,
    error: deleteError,
  } = useMutation("DELETE", "/activities", ["activities"]);

  const {
    mutate: createActivity,
    loading: creating,
    error: createError,
  } = useMutation("POST", "/activities", ["activities"]);

  const [newActivity, setNewActivity] = useState({ name: "", description: "" });

  const handleDelete = (id) => {
    deleteActivity(null, `/activities/${id}`);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createActivity(newActivity);
    setNewActivity({ name: "", description: "" });
  };

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error loading activities: {error}</p>;

  return (
    <div>
      <h1>Activities</h1> <br />
      {activities?.length ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.name} <br />
              {token && (
                <button
                  onClick={() => handleDelete(activity.id)}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
      {deleteError && (
        <p style={{ color: "red" }}>Error deleting activity: {deleteError}</p>
      )}

      {token && (
        <form onSubmit={handleCreate}>
          <h3>Add New Activity</h3>
          <input
            type="text"
            placeholder="Name"
            value={newActivity.name}
            onChange={(e) =>
              setNewActivity({ ...newActivity, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newActivity.description}
            onChange={(e) =>
              setNewActivity({ ...newActivity, description: e.target.value })
            }
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? "Adding..." : "Add Activity"}
          </button>
          {createError && (
            <p style={{ color: "red" }}>Error adding activity: {createError}</p>
          )}
        </form>
      )}
    </div>
  );
}
