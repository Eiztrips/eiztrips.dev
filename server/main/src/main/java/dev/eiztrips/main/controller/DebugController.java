package dev.eiztrips.main.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/debug")
public class DebugController {
    @RequestMapping("/")
    public String healthCheck() {
        return "App is working.";
    }
}
