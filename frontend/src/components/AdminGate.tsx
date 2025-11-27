import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_ID = "500119480";

export const AdminGate = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputID, setInputID] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        const auth = sessionStorage.getItem("adminAuth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputID === ADMIN_ID) {
            sessionStorage.setItem("adminAuth", "true");
            setIsAuthenticated(true);
            toast({
                title: "Access Granted",
                description: "Welcome to the Admin Dashboard.",
            });
        } else {
            toast({
                title: "Access Denied",
                description: "Invalid Admin ID.",
                variant: "destructive",
            });
            setInputID("");
        }
    };

    if (isAuthenticated) {
        return <Outlet />;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 animate-fade-in">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-indigo-500" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl text-white">Admin Access</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your SAP ID to verify your identity.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    type="password"
                                    placeholder="Enter Admin ID"
                                    value={inputID}
                                    onChange={(e) => setInputID(e.target.value)}
                                    className="pl-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Verify Access
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
