import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, FileText, Video, Search, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Materials = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/study-materials');
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Error",
        description: "Could not load study materials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter materials based on search query and selected subject
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = searchQuery === "" ||
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material.topic && material.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (material.tags && material.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesSubject = selectedSubject === "all" ||
      material.subject.toLowerCase() === selectedSubject.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return Video;
      case 'notes': return FileText;
      default: return BookOpen;
    }
  };

  const getColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'mathematics': return 'gradient-primary';
      case 'physics': return 'gradient-secondary';
      case 'chemistry': return 'gradient-accent';
      default: return 'gradient-primary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">Study Materials</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search topics, chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="social science">Social Science</SelectItem>
              <SelectItem value="computer science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No materials found matching your criteria.</p>
          </div>
        ) : (
          filteredMaterials.map((material, index) => {
            const Icon = getIcon(material.type);
            const color = getColor(material.subject);

            return (
              <Card key={material._id || index} className="glass hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant={material.isPremium ? "default" : "secondary"}>
                      {material.isPremium ? "Premium" : "Free"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-1">{material.title}</h3>
                    <p className="text-sm text-muted-foreground">{material.subject} • {material.topic}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {material.tags && material.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">View Content</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary"
                      onClick={() => navigate(`/materials/${material._id}`)}
                    >
                      View →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Materials;
