"use client";

import React, { useState, useEffect } from "react";
import Studenttile from "@/components/genui/Studenttile";

import { StudyPack } from "@/libs/types";
import { useToast } from "@/hooks/use-toast";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

function StudentStudy() {
  const { toast } = useToast();
  const [studentMaterials, setStudentMaterials] = useState<StudyPack[]>([]);

  useEffect(() => {
    const fetchStudentMaterials = async () => {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/studypacks`,
      };

      try {
        const response = await axios.request(config);
        setStudentMaterials(response.data.studyPacks);
      } catch (error) {
        console.error("Error fetching student materials:", error);
        toast({
          title: "Error",
          description: "Error fetching student materials",
          variant: "destructive",
        });
      }
    };
    fetchStudentMaterials();
  }, [toast]);

  return (
    <div className=" p-4  sm:p-20 lg:px-40 w-full flex flex-col gap-12 justify-start items-start ">
      <h3 className="text-primary text-3xl sm:text-4xl font-bold font-mono ">
        Student Study Pack
      </h3>
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        aria-label="Downloadable Contents"
      >
        {studentMaterials.map((post) => (
          <Studenttile key={post.id} studypack={post} />
        ))}
      </section>
    </div>
  );
}

export default StudentStudy;
