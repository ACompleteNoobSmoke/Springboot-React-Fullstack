package com.example.demo.student;


import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class StudentService {

    private final StudentRepository studentRepo;

    public List<Student> getAllStudents(){
            return studentRepo.findAll();
    }

    public void addStudent(Student newStudent) {
        boolean emailExists =
                studentRepo.SelectStudentsByEmail(newStudent.getEmail());
        if(emailExists){ throw new BadRequestException("Student Exist"); }

        studentRepo.save(newStudent);
    }

    public void removeStudent(Long studentID) {
        Optional studentExists = studentRepo.findById(studentID);
        if(studentExists.isEmpty()) throw new StudentNotFoundException("Student Does Not Exists");
        studentRepo.deleteById(studentID);
    }
}
