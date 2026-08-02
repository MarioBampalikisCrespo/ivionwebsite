package com.ivion.main.controller;

import com.ivion.main.dto.ColourDTO;
import com.ivion.main.service.ColourService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/colours")
@RequiredArgsConstructor
public class ColourController {

    private final ColourService colourService;

    @GetMapping
    public List<ColourDTO> getAll() {
        return colourService.findAll();
    }
}
