package magazyn.projekt.api.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import magazyn.projekt.api.model.Complaint;
import magazyn.projekt.api.repos.ComplaintRepo;
import magazyn.projekt.config.TokenBasedAuthorizationHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaint")
@AllArgsConstructor
public class ComplaintController {
    ComplaintRepo complaintRepo;
    TokenBasedAuthorizationHandler authorizationHandler;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT') OR hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> getAllComplaints() {
        return ResponseEntity.ok(complaintRepo.findAll());
    }

    @Getter
    @Setter
    public static class AddComplaintRequest {
        private Long serviceId;
        private String description;

    }

    @PutMapping
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@RequestParam("complaint") Long complaintId,
                                          @RequestParam("status") Complaint.Status status) {
        var complaintOpt = complaintRepo.findById(complaintId);
        if (complaintOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var complaint = complaintOpt.get();
        complaint.setStatus(status);
        complaint = complaintRepo.save(complaint);
        return ResponseEntity.ok(complaint);
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<?> addComplaint(@RequestBody AddComplaintRequest addComplaintRequest, HttpServletRequest request) {
        var user = authorizationHandler.getUserFromHttpRequest(request);
        var userServiceOpt = user.getClientServices()
                .stream()
                .filter(cs -> cs.getId().longValue() == addComplaintRequest.getServiceId())
                .findFirst();
        if (userServiceOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Klient nie posiada takiej usługi");
        }
        var userService = userServiceOpt.get();
        var complaint = complaintRepo.save(Complaint.builder()
                .service(userService)
                .status(Complaint.Status.ONGOING)
                .description(addComplaintRequest.getDescription())
                .build()
        );
        return ResponseEntity.ok(complaint);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('SERVICE') OR hasRole('ADMIN')")
    public ResponseEntity<?> deleteComplaint(@RequestParam("complaint") Long complaintId) {
        complaintRepo.deleteById(complaintId);
        return ResponseEntity.ok().build();
    }

}
