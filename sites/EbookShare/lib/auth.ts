import { account } from "./appwrite"
import { ID } from "appwrite"
import { isAppwriteConfigured } from "./appwrite"

export interface AuthUser {
  $id: string
  email: string
  name: string
  emailVerification: boolean
  $createdAt: string
}

export class AuthService {
  private checkConfiguration() {
    if (!isAppwriteConfigured) {
      throw new Error(
        "Appwrite is not properly configured. Please set up your environment variables. See APPWRITE_SETUP.md for instructions.",
      )
    }
  }

  // Create account
  async createAccount(email: string, password: string, name: string) {
    try {
      this.checkConfiguration()
      console.log("[v0] Creating account for:", email)
      const newAccount = await account.create(ID.unique(), email, password, name)
      console.log("[v0] Account created successfully:", newAccount.$id)
      return newAccount
    } catch (error) {
      console.error("[v0] Error creating account:", error)
      if (error instanceof Error && error.message.includes("Appwrite is not properly configured")) {
        throw error
      }
      throw new Error("Failed to create account. Please check your network connection and try again.")
    }
  }

  // Login
  async login(email: string, password: string) {
    try {
      this.checkConfiguration()
      console.log("[v0] Attempting login for:", email)
      const session = await account.createEmailPasswordSession(email, password)
      console.log("[v0] Login successful")
      return session
    } catch (error) {
      console.error("[v0] Error logging in:", error)
      if (error instanceof Error && error.message.includes("Appwrite is not properly configured")) {
        throw error
      }
      throw new Error("Invalid email or password. Please try again.")
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      if (!isAppwriteConfigured) {
        return null
      }
      return await account.get()
    } catch (error) {
      return null
    }
  }

  // Logout
  async logout() {
    try {
      this.checkConfiguration()
      return await account.deleteSession("current")
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  // Send verification email
  async sendVerification() {
    try {
      this.checkConfiguration()
      return await account.createVerification(`${window.location.origin}/verify`)
    } catch (error) {
      console.error("Error sending verification:", error)
      throw error
    }
  }
}

export const authService = new AuthService()
