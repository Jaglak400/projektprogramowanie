package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import magazyn.projekt.api.model.Complaint;
import magazyn.projekt.api.repos.ComplaintRepo;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaint")
@AllArgsConstructor
public class ComplaintController {
    ComplaintRepo complaintRepo;
    TokenBasedAuthorizationHandler authorizationHandler;

    @GetMapping
    public ResponseEntity<?> getAllComplaints(){
        return ResponseEntity.ok(complaintRepo.findAll());
    }

    @PutMapping
    public ResponseEntity<?> updateStatus(@RequestParam("complaint") Long complaintId,
                                          @RequestParam("status") Complaint.Status status){
        var complaintOpt = complaintRepo.findById(complaintId);
        if(complaintOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        var complaint = complaintOpt.get();
        complaint.setStatus(status);
        complaint = complaintRepo.save(complaint);
        return ResponseEntity.ok(complaint);
    }

    @PostMapping
    public ResponseEntity<?> addComplaint(@RequestParam("service") Long serviceId,
                                          @RequestBody String description,
                                          HttpServletRequest request){
        var user = authorizationHandler.getUserFromHttpRequest(request);
        var userServiceOpt = user.getClientServices()
                .stream()
                .filter(cs -> cs.getId().longValue() == serviceId)
                .findFirst();
        if(userServiceOpt.isEmpty()){
            return ResponseEntity.badRequest().body("User has no such service");
        }
        var userService = userServiceOpt.get();
        var complaint = complaintRepo.save(Complaint.builder()
                .service(userService)
                .status(Complaint.Status.ONGOING)
                .description(description)
                .build()
        );
        return ResponseEntity.ok(complaint);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteComplaint(@RequestParam("complaint") Long complaintId){
        complaintRepo.deleteById(complaintId);
        return ResponseEntity.ok().build();
    }
}
