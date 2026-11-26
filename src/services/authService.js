import { db } from "./mockStore";
import { byCompany, copy, delay, nextId } from "../utils/helpers";

function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  const role = db.roles.find((item) => item.id === user.roleId);
  return {
    ...copy(safe),
    permissions: role?.permissions || [],
    role: role ? { id: role.id, name: role.name, slug: role.slug } : null,
  };
}

export const authService = {
  async login(email, password) {
    await delay();
    const user = db.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password,
    );
    if (!user || user.status !== "active") {
      throw new Error("Invalid email or password.");
    }
    user.lastLogin = new Date().toISOString();
    return {
      token: `mock-token-${user.id}`,
      user: publicUser(user),
    };
  },

  async forgotPassword(email) {
    await delay();
    const exists = db.users.some((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!exists) throw new Error("No account found for that email.");
    return { message: "A reset link was sent to your email." };
  },

  async resetPassword(userId, password) {
    await delay();
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new Error("User not found.");
    user.password = password;
    return publicUser(user);
  },
};
