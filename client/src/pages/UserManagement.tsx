import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserTable } from "../components/users/UserTable";
import { userService } from "../services/user";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getUsers,
  });
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    password: string;
  }>({
    name: "",
    email: "",
    role: "USER",
    password: "",
  });

  const updateMutation = useMutation({
    mutationFn: userService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        role: "USER",
        password: "",
      });
    },
  });

  const handleAddUser = async () => {
    await addMutation.mutateAsync({
      ...newUser,
      password: "Password!123",
    });
  };

  const handleUpdateRole = async (id: string, role: "ADMIN" | "USER") => {
    await updateMutation.mutateAsync({ id, role });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter((user) => {
    const matchesFilter =
      filter === "all" || user.role.toLowerCase() === filter;
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user roles and permissions
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-sm"
          >
            All
          </Button>
          <Button
            variant={filter === "admin" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("admin")}
            className="text-sm"
          >
            Admin
          </Button>
          <Button
            variant={filter === "user" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("user")}
            className="text-sm"
          >
            User
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="default"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <UserTable
          users={filteredUsers}
          onUpdate={handleUpdateRole}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="ghost"
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
