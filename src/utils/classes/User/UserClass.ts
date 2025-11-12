export default class UserClass {
  async create(data: { name: string; email: string; password: string }) {
    try {
      if (data.password.length < 8) {
        return { success: false, error: "A senha precisa conter ao menos 8 caracteres." };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, error: "Email inválido." };
      }

      const res = await fetch("/api/posts/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `Erro ao criar usuário: ${errorText}` };
      }

      const response = await res.json();
      return { success: true, response: response };

    } catch (error) {
      return { success: false, error: (error as Error).message || "Erro desconhecido." };
    }
  }

  async login(data: { email: string; password: string }) {
    try {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, error: "Email inválido." };
      }

      const res = await fetch("/api/posts/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `Erro ao efetuar login: ${errorText}` };
      }

      const response = await res.json();
      return { success: true, userInfo: response };

    } catch (error) {
      return { success: false, error: (error as Error).message || "Erro desconhecido." };
    }
  }
}
